import ThundraLogger from '../ThundraLogger';
import ModuleVersionValidator from './ModuleVersionValidator';

const Hook = require('require-in-the-middle');
const shimmer = require('shimmer');
const path = require('path');
const parse = require('module-details-from-path');

declare var __non_webpack_require__: any;
const customReq = typeof __non_webpack_require__ !== 'undefined'
    ? __non_webpack_require__
    : require;
const thundraWrapped = '__thundra_wrapped';

/**
 * Common/global utilities for module related stuff
 */
class ModuleUtils {

    private constructor() {
    }

    /**
     * Tries to require given module by its name and paths
     * @param {string} name the module name
     * @param {string[]} paths the paths to be looked for module
     * @return the required module
     */
    static tryRequire(name: string, paths?: string[]): any {
        try {
            let resolvedPath;
            if (paths) {
                resolvedPath = customReq.resolve(name, { paths });
            } else {
                resolvedPath = customReq.resolve(name);
            }
            return customReq(resolvedPath);
        } catch (e) {
            ThundraLogger.debug(`<ModuleUtils> Couldn't require module ${name} in the paths ${paths}:`, e);
        }
    }

    /**
     * Instruments given module by its name
     * @param {string[]} moduleNames the modules names to instrument
     * @param {string} version the version of the library
     * @param wrapper the wrapper to instrument
     * @param unwrapper the unwrapper to un-instrument
     * @param config the config to be passed to wrapper and unwrapper
     * @param {string[]} paths the paths to be looked for module to instrument
     * @param {string} fileName the name of the file in module to instrument
     * @return the context to manage instrumentation cycle (for ex. un-instrument)
     */
    static instrument(moduleNames: string[], version: string, wrapper: any,
                      unwrapper?: any, config?: any, paths?: string[], fileName?: string): any {
        const libs: any[] = [];
        const hooks: any[] = [];
        for (const moduleName of moduleNames) {
            const requiredLib = ModuleUtils.tryRequire(fileName ? path.join(moduleName, fileName) : moduleName, paths);
            if (requiredLib) {
                if (version) {
                    const { basedir } = ModuleUtils.getModuleInfo(moduleName);
                    if (!basedir) {
                        ThundraLogger.error(`<Utils> Base directory is not found for the package ${moduleName}`);
                        return;
                    }
                    ModuleUtils.doInstrument(requiredLib, libs, basedir, moduleName, version, wrapper, config);
                } else {
                    ModuleUtils.doInstrument(requiredLib, libs, null, moduleName, null, wrapper, config);
                }
            }
            const hook = Hook(moduleName, { internals: true }, (lib: any, name: string, basedir: string) => {
                if (name === moduleName) {
                    ModuleUtils.doInstrument(lib, libs, basedir, moduleName, version, wrapper, config);
                }
                return lib;
            });
            hooks.push(hook);
        }
        return {
            uninstrument: () => {
                for (const lib of libs) {
                    if (unwrapper) {
                        unwrapper(lib, config);
                    }
                    delete lib[thundraWrapped];
                }
                for (const hook of hooks) {
                    hook.unhook();
                }
            },
        };
    }

    /**
     * Patches the given method of the specified module by wrapper.
     * @param {string} moduleName name of the module to be patched
     * @param {string} methodName name of the method to be patched
     * @param {Function} wrapper to wrap the actual patched method
     * @param {Function} extractor extracts the member (for ex. exported module/class)
     *                   from given module to patch
     */
    static patchModule(moduleName: string, methodName: string,
                       wrapper: Function, extractor: Function = (mod: any) => mod): boolean {
        const module = ModuleUtils.tryRequire(moduleName);
        if (module) {
            shimmer.wrap(extractor(module), methodName, wrapper);
            return true;
        } else {
            ThundraLogger.debug(`<ModuleUtils> Couldn't find module ${moduleName} to patch`);
            return false;
        }
    }

    private static getModuleInfo(name: string, paths?: string[]): any {
        try {
            let modulePath;
            if (paths !== undefined) {
                modulePath = customReq.resolve(name, { paths });
            } else {
                modulePath = customReq.resolve(name);
            }
            return parse(modulePath);
        } catch (e) {
            ThundraLogger.debug(`<ModuleUtils> Couldn't get info of module ${name} in the paths ${paths}:`, e);
            return {};
        }
    }

    private static doInstrument(lib: any, libs: any[], basedir: string, moduleName: string,
                                version: string, wrapper: any, config?: any): any {
        let isValid = false;
        if (version) {
            const moduleValidator = new ModuleVersionValidator();
            const isValidVersion = moduleValidator.validateModuleVersion(basedir, version);
            if (!isValidVersion) {
                ThundraLogger.error(
                    `<ModuleUtils> Invalid module version for ${moduleName} integration. Supported version is ${version}`);
            } else {
                isValid = true;
            }
        } else {
            isValid = true;
        }
        if (isValid) {
            if (!lib[thundraWrapped]) {
                wrapper(lib, config, moduleName);
                lib[thundraWrapped] = true;
                libs.push(lib);
            }
        }
    }

}

export default ModuleUtils;
