import ThundraLogger from '../../ThundraLogger';
import ModuleVersionValidator from '../../utils/ModuleVersionValidator';
import libs from './lib';

const path = require('path');
const Hook = require('require-in-the-middle');

export function init() {

    libs.forEach((value: any, key: any) => {

        [].concat(value)
        .forEach((instrumentation) => {

            const moduleName = instrumentation.name;
            const version = instrumentation.version;
            let notSupportedVersion = '';

            try {

                const hook = (lib: any, name: string, basedir: string) => {

                    if (name === moduleName) {

                        const isValidVersion = ModuleVersionValidator.validateModuleVersion(basedir, version);
                        if (isValidVersion) {

                            return instrumentation.patch.call(this, lib);
                        }

                        notSupportedVersion = require(path.join(basedir, 'package.json')).version;

                        ThundraLogger.error(
                            `<ForesightInit> Version ${notSupportedVersion} is invalid for module ${moduleName}.
                            Supported version is ${version}`);
                    }

                    return lib;
                };

                Hook(moduleName, { }, hook);
            } catch (e) {

                ThundraLogger.error(
                    `<ForesightInit> Foresight did not initialized module ${moduleName} for version ${notSupportedVersion}.`);
            }
        });
    });

    return true;
}
