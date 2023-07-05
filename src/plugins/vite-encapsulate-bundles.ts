import type {Plugin} from 'vite';

export interface ViteEncapsulateBundlesOptions {
    banner: string,
    footer: string
}

/**
 * A custom ViteJS plugin that encapsulate bundles
 *
 * @param userOptions
 */
export default function (userOptions?: Partial<ViteEncapsulateBundlesOptions>): Plugin {

    /**
     * Core plugin options
     */
    const options = {
        ...{
            banner: '(function(){',
            footer: '})();'
        },
        ...userOptions
    };

    /**
     * Plugin hooks
     */
    return {

        /**
         * Plugin name
         */
        name: 'vite-encapsulate-bundles',

        /**
         * Generate bundle hook
         *
         * @param bundleOptions
         * @param bundle
         */
        generateBundle(bundleOptions, bundle) {

            for (const module of Object.values(bundle)) {

                if (module.type === 'chunk') {
                    module.code = options.banner + module.code + options.footer
                }
            }
        }
    };
}