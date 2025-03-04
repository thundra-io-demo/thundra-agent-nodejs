import ThundraLogger from '../ThundraLogger';
import ExecutionContext from './ExecutionContext';
import * as globalContextProvider from './globalContextProvider';

let contextProvider: any = globalContextProvider;

/**
 * Manages {@link ExecutionContext} and
 * contract point to the outside for {@link ExecutionContext} related operation.
 */
export default class ExecutionContextManager {

    /**
     * Initializes {@link ExecutionContextManager}
     */
    static init() {
        contextProvider.init();
    }

    /**
     * Sets the {@link ExecutionContext} provider
     * @param provided the {@link ExecutionContext} provider to be set
     */
    static setProvider(provider: any) {

        const contextCanChangeable = contextProvider.canChangeablebleContext();
        if (!contextCanChangeable) {

            ThundraLogger.debug(`<ExecutionContextManager> Default context provider set as ${contextProvider.PROVIDER_NAME}.`
            + 'It is not changeable.');

            return;
        }

        contextProvider = provider;
    }

    /**
     * Sets the {@link ExecutionContext} provider to globalContextProvider
     */
    static useGlobalProvider() {
        contextProvider = globalContextProvider;
    }

    /**
     * Runs given {@param fn} in the created {@link ExecutionContext}
     * by given {@param createExecContext}
     * @param {Function} createExecContext creates {@link ExecutionContext}
     * @param {Function} fn runs in the created {@link ExecutionContext}
     */
    static runWithContext(createExecContext: Function, fn: Function) {
        return contextProvider.runWithContext(createExecContext, fn);
    }

    /**
     * Gets the {@link ExecutionContext}
     * @return {ExecutionContext} the {@link ExecutionContext}
     */
    static get(): ExecutionContext {
        const execContext: ExecutionContext = contextProvider.get();
        if (execContext) {
            return execContext;
        } else {
            return {} as ExecutionContext;
        }
    }

    /**
     * Sets the {@link ExecutionContext}
     * @param {ExecutionContext} execCtx {@link ExecutionContext} to be set
     */
    static set(execCtx: ExecutionContext) {
        return contextProvider.set(execCtx);
    }

}
