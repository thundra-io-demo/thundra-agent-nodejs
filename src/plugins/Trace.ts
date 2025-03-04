import Utils from '../utils/Utils';
import TraceConfig from './config/TraceConfig';
import MonitoringDataType from './data/base/MonitoringDataType';
import ThundraSpan from '../opentracing/Span';
import SpanData from './data/trace/SpanData';
import PluginContext from './PluginContext';
import { INTEGRATIONS } from '../Constants';
import * as opentracing from 'opentracing';
import ThundraLogger from '../ThundraLogger';
import Integration from '../integrations/Integration';
import Instrumenter from '../opentracing/instrument/Instrumenter';
import ConfigProvider from '../config/ConfigProvider';
import ConfigNames from '../config/ConfigNames';
import ExecutionContext from '../context/ExecutionContext';
import GlobalTracer from '../opentracing/GlobalTracer';
import Plugin from './Plugin';

const get = require('lodash.get');

/**
 * The trace plugin for trace support
 */
export default class Trace implements Plugin {

    public static readonly NAME: string = 'Trace';

    pluginOrder: number = 1;
    pluginContext: PluginContext;
    hooks: {
        'before-invocation': (execContext: ExecutionContext) => void;
        'after-invocation': (execContext: ExecutionContext) => void;
    };
    config: TraceConfig;
    integrationsMap: Map<string, Integration>;
    instrumenter: Instrumenter;
    listeners: any[];

    constructor(config: TraceConfig) {
        this.hooks = {
            'before-invocation': this.beforeInvocation,
            'after-invocation': this.afterInvocation,
        };

        this.config = config;
        this.listeners = Utils.createSpanListeners();

        this.initIntegrations();

        opentracing.initGlobalTracer(new GlobalTracer());
    }

    /**
     * @inheritDoc
     */
    getName(): string {
        return Trace.NAME;
    }

    /**
     * Sets the the {@link PluginContext}
     * @param {PluginContext} pluginContext the {@link PluginContext}
     */
    setPluginContext = (pluginContext: PluginContext) => {
        this.pluginContext = pluginContext;
    }

    /**
     * Called before invocation
     * @param {ExecutionContext} execContext the {@link ExecutionContext}
     */
    beforeInvocation = (execContext: ExecutionContext) => {
        ThundraLogger.debug('<Trace> Before invocation of transaction', execContext.transactionId);

        const { executor } = this.pluginContext;
        const { tracer } = execContext;

        tracer.setSpanListeners(this.listeners);

        if (executor) {
            executor.startTrace(this.pluginContext, execContext, this.config);
        }
    }

    /**
     * Called after invocation
     * @param {ExecutionContext} execContext the {@link ExecutionContext}
     */
    afterInvocation = (execContext: ExecutionContext) => {
        ThundraLogger.debug('<Trace> After invocation of transaction', execContext.transactionId);

        const { apiKey, executor } = this.pluginContext;
        const { tracer, rootSpan } = execContext;

        if (executor) {
            executor.finishTrace(this.pluginContext, execContext, this.config);
        }

        const spanList: ThundraSpan[] = tracer.getRecorder().getSpanList();
        const sampler = get(this.config, 'sampler', { isSampled: () => true });
        const sampled = sampler.isSampled(rootSpan);

        ThundraLogger.debug('<Trace> Checked sampling of transaction', execContext.transactionId, ':', sampled);

        if (sampled) {
            const debugEnabled: boolean = ThundraLogger.isDebugEnabled();
            let runSamplerOnEach: boolean = this.config.runSamplerOnEachSpan;
            if (!runSamplerOnEach && sampler.sampleOnEach && typeof sampler.sampleOnEach === 'function') {
                runSamplerOnEach = sampler.sampleOnEach();
            }

            let reportedSpanCount: number = 0;
            const highPrioritySpans: any[] = [];
            const lowPrioritySpans: any[] = [];

            for (const span of spanList) {
                if (span) {
                    if (runSamplerOnEach && !sampler.isSampled(span)) {
                        ThundraLogger.debug(
                            `<Trace> Filtering span with name ${span.getOperationName()} due to custom sampling configuration`);
                        continue;
                    }

                    const spanData = this.buildSpanData(span, execContext);
                    const spanReportData = Utils.generateReport(spanData, apiKey);

                    const shouldBeReported: boolean = span.isRootSpan;
                    // On-going (not finished) spans have higher priority (for ex. in case of timeout)
                    const highPriority: boolean = !span.isFinished();

                    if (shouldBeReported) {
                        if (debugEnabled) {
                            ThundraLogger.debug('<Trace> Reporting span:', spanReportData);
                        }
                        execContext.report(spanReportData);
                        reportedSpanCount++;
                    } else {
                        if (highPriority) {
                            highPrioritySpans.push(spanReportData);
                        } else {
                            lowPrioritySpans.push(spanReportData);
                        }
                    }
                }
            }

            // Report high priority spans first until the max limit
            for (const span of highPrioritySpans) {
                if (reportedSpanCount >= this.config.maxSpanCount) {
                    if (debugEnabled) {
                        ThundraLogger.debug(`<Trace> Reached max span limit ${this.config.maxSpanCount}, ` +
                                            `so skipping remaining high priority spans`);
                    }
                    break;
                }
                if (debugEnabled) {
                    ThundraLogger.debug('<Trace> Reporting span:', span);
                }
                execContext.report(span);
                reportedSpanCount++;
            }

            // Then report low priority spans until the max limit
            for (const span of lowPrioritySpans) {
                if (reportedSpanCount >= this.config.maxSpanCount) {
                    if (debugEnabled) {
                        ThundraLogger.debug(`<Trace> Reached max span limit ${this.config.maxSpanCount}, ` +
                                            `so skipping remaining low priority spans`);
                    }
                    break;
                }
                if (debugEnabled) {
                    ThundraLogger.debug('<Trace> Reporting span:', span);
                }
                execContext.report(span);
                reportedSpanCount++;
            }
        }
    }

    /**
     * Destroys plugin
     */
    destroy(): void {
        // pass
    }

    /**
     * Initializes the {@link Instrumenter instrumenter}
     * @param glob the global
     */
    initInstrumenter(glob: NodeJS.Global): void {
        this.instrumenter.setGlobalFunction(glob);
    }

    /**
     * Instruments the given JS code.
     *
     * @param filename  name of the file
     * @param code      the code to be instrumented
     * @return {string}the instrumented code
     */
    instrument(filename: string, code: string): string {
        return this.instrumenter.instrument(filename, code);
    }

    private initIntegrations(): void {
        if (!(this.config.disableInstrumentation || ConfigProvider.get<boolean>(ConfigNames.THUNDRA_TRACE_DISABLE))) {
            this.integrationsMap = new Map<string, Integration>();

            for (const key of Object.keys(INTEGRATIONS)) {
                const integration = INTEGRATIONS[key];
                if (integration) {
                    const clazz = integration.class;
                    if (clazz) {
                        if (!this.integrationsMap.get(key)) {
                            if (!this.config.isIntegrationDisabled(key)) {
                                const instance = new clazz(this.config);
                                this.integrationsMap.set(key, instance);
                            } else {
                                ThundraLogger.debug(`<Trace> Disabled integration ${key}`);
                            }
                        }
                    }
                }
            }

            this.instrumenter = new Instrumenter(this.config);
            this.instrumenter.hookModuleCompile();
        }
    }

    private buildSpanData(span: ThundraSpan, execContext: any): SpanData {
        const spanData = Utils.initMonitoringData(this.pluginContext, MonitoringDataType.SPAN) as SpanData;

        spanData.id = span.spanContext.spanId;
        spanData.traceId = execContext.traceId;
        spanData.transactionId = execContext.transactionId;
        spanData.parentSpanId = span.spanContext.parentId;
        spanData.spanOrder = span.order;
        spanData.domainName = span.domainName ? span.domainName : '';
        spanData.className = span.className ? span.className : '';
        spanData.serviceName = execContext.rootSpan.operationName;
        spanData.operationName = span.operationName;
        spanData.startTimestamp = span.startTime;
        spanData.duration = span.getDuration();
        spanData.finishTimestamp = span.finishTime;
        spanData.tags = span.tags;
        spanData.logs = span.logs;

        return spanData;
    }

}
