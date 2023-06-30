import type {Plugin} from 'vite';

export interface RollupEncapsulateBundlesOptions {
    banner: string,
    footer: string
}

/**
 * A custom RollUpJS plugin that encapsulate bundles
 *
 * @param userOptions
 */
export default function (userOptions?: Partial<RollupEncapsulateBundlesOptions>): Plugin {
    const options = {
        ...{
            banner: '(function(){',
            footer: '})();'
        },
        ...userOptions
    };
    return {
        name: 'rollup-encapsulate-bundles',
        generateBundle(bundleOptions, bundle) {

            for (const module of Object.values(bundle)) {

                if (module.type === 'chunk') {
                    module.code = options.banner + module.code + options.footer
                }
            }
        }
    };
}