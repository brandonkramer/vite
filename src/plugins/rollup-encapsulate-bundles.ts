import type {Plugin} from 'vite';

export interface RollupEncapsulateBundlesConfig {
    banner: string,
    footer: string
}

/**
 * A custom RollUpJS plugin that encapsulate bundles
 *
 * @param userRollupEncapsulateBundlesConfig
 */
export default function (userRollupEncapsulateBundlesConfig?: Partial<RollupEncapsulateBundlesConfig>): Plugin {
    const config = {
        ...{
            banner: '(function(){',
            footer: '})();'
        },
        ...userRollupEncapsulateBundlesConfig
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