import Utils from '../../utils/Utils';
import { HttpTags, DomainNames, ClassNames } from '../../Constants';
import PluginContext from '../../plugins/PluginContext';
import MonitoringDataType from '../../plugins/data/base/MonitoringDataType';
import InvocationData from '../../plugins/data/invocation/InvocationData';
import TimeoutError from '../../error/TimeoutError';
import InvocationSupport from '../../plugins/support/InvocationSupport';
import InvocationTraceSupport from '../../plugins/support/InvocationTraceSupport';
import ThundraSpanContext from '../../opentracing/SpanContext';
import * as opentracing from 'opentracing';
import ThundraSpan from '../../opentracing/Span';
import ExecutionContext from '../../context/ExecutionContext';

const get = require('lodash.get');

export function startInvocation(pluginContext: PluginContext, execContext: any) {
    const invocationData = Utils.initMonitoringData(pluginContext,
        MonitoringDataType.INVOCATION) as InvocationData;

    invocationData.applicationPlatform = '';
    invocationData.applicationRegion = pluginContext.applicationInfo.applicationRegion;
    invocationData.tags = {};
    invocationData.userTags = {};
    invocationData.startTimestamp = execContext.startTimestamp;
    invocationData.finishTimestamp = 0;
    invocationData.duration = 0;
    invocationData.erroneous = false;
    invocationData.errorType = '';
    invocationData.errorMessage = '';
    invocationData.coldStart = pluginContext.requestCount === 0;
    invocationData.timeout = false;

    invocationData.traceId = execContext.traceId;
    invocationData.transactionId = execContext.transactionId;
    invocationData.spanId = execContext.spanId;

    execContext.invocationData = invocationData;
}

export function finishInvocation(pluginContext: PluginContext, execContext: any) {
    const { error, invocationData } = execContext;

    if (error) {
        const parsedErr = Utils.parseError(error);
        invocationData.setError(parsedErr);

        if (error instanceof TimeoutError) { // TODO: Move to platform utils
            invocationData.timeout = true;
            invocationData.tags['aws.lambda.invocation.timeout'] = true;
        }

        invocationData.tags.error = true;
        invocationData.tags['error.message'] = parsedErr.errorMessage;
        invocationData.tags['error.kind'] = parsedErr.errorType;
        invocationData.tags['error.stack'] = parsedErr.stack;
        if (parsedErr.code) {
            invocationData.tags['error.code'] = error.code;
        }
        if (parsedErr.stack) {
            invocationData.tags['error.stack'] = error.stack;
        }
    }

    invocationData.setTags(InvocationSupport.getAgentTags());
    invocationData.setUserTags(InvocationSupport.getTags());

    const { startTimestamp, finishTimestamp, spanId, response } = execContext;

    invocationData.finishTimestamp = finishTimestamp;
    invocationData.duration = finishTimestamp - startTimestamp;
    invocationData.resources = InvocationTraceSupport.getResources(spanId);
    invocationData.incomingTraceLinks = InvocationTraceSupport.getIncomingTraceLinks();
    invocationData.outgoingTraceLinks = InvocationTraceSupport.getOutgoingTraceLinks();

    if (Utils.isValidHTTPResponse(response)) {
        invocationData.setUserTags({ [HttpTags.HTTP_STATUS]: response.statusCode });
    }
}

export function startTrace(pluginContext: PluginContext, execContext: ExecutionContext) {
    const { tracer, request } = execContext;
    const propagatedSpanContext: ThundraSpanContext =
        tracer.extract(opentracing.FORMAT_HTTP_HEADERS, request.headers) as ThundraSpanContext;

    const traceId = get(propagatedSpanContext, 'traceId') || Utils.generateId();

    const rootSpan = tracer._startSpan('express-root-span', {
        propagated: propagatedSpanContext ? true : false,
        parentContext: propagatedSpanContext,
        rootTraceId: traceId,
        domainName: DomainNames.API,
        className: ClassNames.EXPRESS,
    });

    execContext.traceId = traceId;
    execContext.rootSpan = rootSpan;
    execContext.spanId = execContext.rootSpan.spanContext.spanId;
    execContext.rootSpan.startTime = execContext.startTimestamp;

    // Put initial root span tags
    Utils.copyProperties(
        request,
        [
            'method',
            'query',
            'hostname',
            'path',
            'body',
        ],
        rootSpan.tags,
        [
            HttpTags.HTTP_METHOD,
            HttpTags.QUERY_PARAMS,
            HttpTags.HTTP_HOST,
            HttpTags.HTTP_PATH,
            HttpTags.BODY,
        ],
    );
}

export function finishTrace(pluginContext: PluginContext, execContext: any) {
    const { rootSpan, finishTimestamp, response } = execContext;

    rootSpan.finish();
    rootSpan.finishTime = finishTimestamp;

    Utils.copyProperties(response, ['statusCode'], rootSpan.tags, [HttpTags.HTTP_STATUS]);
}
