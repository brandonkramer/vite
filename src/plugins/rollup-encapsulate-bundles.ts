import type {Plugin} from 'vite';

export interface Config {
    banner: string,
    footer: string
}

const DEFAULT_CONFIG: Config = {
    banner: '(function(){',
    footer: '})();'
};

export default function (userConfig?: Partial<Config>): Plugin {
    const config = {
        ...DEFAULT_CONFIG,
        ...userConfig
    };
    return {
        name: 'rollup-encapsulate-bundles',
        generateBundle(options, bundle) {

            for (const module of Object.values(bundle)) {

                if (module.type === 'chunk') {
                    module.code = config.banner + module.code + config.footer
                }
            }
        }
    };
}