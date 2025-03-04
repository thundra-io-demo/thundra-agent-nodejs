import Integration from './Integration';
import ModuleUtils from '../utils/ModuleUtils';
import ExecutionContextManager from '../context/ExecutionContextManager';
import ThundraSpan from '../opentracing/Span';
import { AWSServiceIntegration } from './AWSServiceIntegration';
import * as opentracing from 'opentracing';
import { DB_INSTANCE } from 'opentracing/lib/ext/tags';
import ThundraLogger from '../ThundraLogger';
import Utils from '../utils/Utils';
import ThundraChaosError from '../error/ThundraChaosError';
import { INTEGRATIONS } from '../Constants';

const shimmer = require('shimmer');
const has = require('lodash.has');
const get = require('lodash.get');

const INTEGRATION_NAME = 'aws3';

/**
 * {@link Integration} implementation for AWS integration
 * through {@code aws-sdk v3} library
 */
export class AWSv3Integration implements Integration {

    config: any;
    private wrappedFuncs: any;
    private instrumentContext: any;

    constructor(config: any) {
        ThundraLogger.debug('<AWSv3Integration> Activating AWS v3 integration');

        this.wrappedFuncs = {};
        this.config = config || {};
        const awsSdkv3Integration = INTEGRATIONS[INTEGRATION_NAME];
        this.instrumentContext = ModuleUtils.instrument(
            awsSdkv3Integration.moduleNames, awsSdkv3Integration.moduleVersion,
            (lib: any, cfg: any) => {
                this.wrap.call(this, lib, cfg);
            },
            (lib: any, cfg: any) => {
                this.doUnwrap.call(this, lib);
            },
            this.config);
    }

    /**
     * @inheritDoc
     */
    wrap(lib: any, config: any) {
        AWSServiceIntegration.parseAWSOperationTypes();

        const integration = this;
        function wrapper(wrappedFunction: any, wrappedFunctionName: string) {
            integration.wrappedFuncs[wrappedFunctionName] = wrappedFunction;
            return function AWSSDKWrapper(command: any, optionsOrCb: any, cb: any) {
                ThundraLogger.debug('<AWSv3Integration> Tracing AWS request:', command);

                const currentInstance = this;
                let activeSpan: ThundraSpan;
                let reachedToCallOriginalFunc: boolean = false;
                try {
                    const { tracer } = ExecutionContextManager.get();

                    if (!tracer) {
                        return wrappedFunction.apply(this, [command, optionsOrCb, cb]);
                    }

                    const originalOptions = typeof optionsOrCb !== 'function' ? optionsOrCb : undefined;
                    const originalCallback = typeof optionsOrCb === 'function' ? optionsOrCb : cb;

                    const request: any = {
                        operation: Utils.makeLowerCase(command.constructor.name.replace('Command', '')),
                        /** if needed use deep copy instead of shallow */
                        params: command.input,
                        service: {
                            serviceIdentifier: currentInstance.config.serviceId.toLowerCase(),
                            config: {},
                        },
                        response: {},
                    };

                    const originalFunction = integration.getOriginalFunction(wrappedFunctionName);

                    activeSpan = AWSServiceIntegration.doCreateSpan(
                        tracer,
                        request,
                        config,
                    );

                    command.middlewareStack.removeByTag('__thundra__');

                    command.middlewareStack.add(
                        (next: any, context: any) => async (args: any) => {
                            ThundraLogger.debug('<AWSv3Integration> Build middleware working...');

                            if (args && args.request
                                && AWSServiceIntegration.isSpanContextInjectableToHeader(request)) {
                                const httpRequest = args.request;
                                const headers = httpRequest.headers ? httpRequest.headers : {};
                                tracer.inject(activeSpan.spanContext, opentracing.FORMAT_TEXT_MAP, headers);
                                args.request.headers = headers;
                            }

                            activeSpan._initialized();

                            const result = await next(args);
                            return result;
                        }, {
                            step: 'build',
                            priority: 'low',
                            name: 'thundra_build_middileware',
                            tags: ['__thundra__'],
                        },
                    );

                    command.middlewareStack.add(
                        (next: any, context: any) => async (args: any) => {
                            ThundraLogger.debug('<AWSv3Integration> Deserialize middleware working...');

                            request.service.config.region = await currentInstance.config.region();
                            request.service.config.endpoint = await currentInstance.config.endpoint();

                            if (activeSpan.tags[DB_INSTANCE] === '') {
                                activeSpan.tags[DB_INSTANCE] = request.service.config.endpoint.hostname;
                            }

                            const result = await next(args);

                            request.response = result.response;
                            return result;
                        }, {
                            step: 'deserialize',
                            priority: 'low',
                            name: 'thundra_deserialize_middileware',
                            tags: ['__thundra__'],
                        },
                    );

                    const wrappedCallback = function (err: any, data: any, closeWithCallback = false) {
                        ThundraLogger.debug('<AWSv3Integration> WrappedCallback working...');

                        if (!activeSpan) {
                            return;
                        }

                        request.response = {
                            ...request.response,
                            ...( data ? { data } : undefined ),
                            httpResponse: { ...request.response },
                        };

                        /* test-code */
                        if (currentInstance.__TESTMOCK__) {
                            request.response = {
                                ...request.response,
                                ...currentInstance.__TESTMOCK__.response,
                            };

                            request.response.httpResponse = {
                                ...request.response.httpResponse,
                                ...currentInstance.__TESTMOCK__.response,
                            };

                            request.service = {
                                ...request.service,
                                ...currentInstance.__TESTMOCK__.service,
                            };
                        }
                        /* test-code */

                        if (data) {
                            try {
                                AWSServiceIntegration.doProcessResponse(
                                    activeSpan,
                                    request,
                                    request.response,
                                    config,
                                );

                                AWSServiceIntegration.injectTraceLink(
                                    activeSpan,
                                    request,
                                    request.response,
                                    config,
                                );
                            } catch (error) {
                                ThundraLogger.error('<AWSv3Integration> Response data did not processed.', error);
                            }
                        }

                        if (err) {
                            ThundraLogger.debug('<AWSv3Integration> WrappedCallback with error:', err);
                            activeSpan.setErrorTag(err);
                        }

                        if (closeWithCallback) {
                            activeSpan.closeWithCallback(this, originalCallback, [err, data]);
                        } else {
                            activeSpan.close();
                        }
                    };

                    reachedToCallOriginalFunc = true;
                    if (originalCallback) {
                        return originalFunction.apply(
                            this,
                            [
                                command,
                                originalOptions,
                                function (err: any, data: any) {
                                    wrappedCallback(err, data, true);
                                },
                            ]);
                    } else {
                        const result = originalFunction.apply(this, [command, originalOptions, cb]);
                        if (result && typeof result.then === 'function') {
                            result.then((data: any) => {
                                wrappedCallback(null, data);
                            }).catch((error: any) => {
                                wrappedCallback(error, null);
                            });
                        } else {
                            if (activeSpan) {
                                activeSpan.close();
                            }
                        }

                        return result;
                    }
                } catch (error) {
                    if (activeSpan) {
                        activeSpan.close();
                    }

                    if (reachedToCallOriginalFunc || error instanceof ThundraChaosError) {
                        throw error;
                    } else {
                        ThundraLogger.error('<AWSv3Integration> An error occurred while tracing.', error);
                        const originalFunction = integration.getOriginalFunction(wrappedFunctionName);
                        return originalFunction.apply(this, [command, optionsOrCb, cb]);
                    }
                }
            };
        }

        if (has(lib, 'Client.prototype.send')) {
            ThundraLogger.debug('<AWSv3Integration> Wrapping "Client.prototype.send"');
            shimmer.wrap(lib.Client.prototype, 'send', (wrapped: Function) => wrapper(wrapped, 'send'));
        }
    }

    /**
     * Unwraps given library
     * @param lib the library to be unwrapped
     */
    doUnwrap(lib: any) {
        if (has(lib, 'Client.prototype.send')) {
            shimmer.unwrap(lib.Client.prototype, 'send');
        }
    }

    /**
     * @inheritDoc
     */
    unwrap() {
        if (this.instrumentContext.uninstrument) {
            this.instrumentContext.uninstrument();
        }
    }

    private getOriginalFunction(wrappedFunctionName: string) {
        return get(this, `wrappedFuncs.${wrappedFunctionName}`);
    }

}
