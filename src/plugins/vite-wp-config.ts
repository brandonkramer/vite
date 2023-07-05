import type {
    Plugin,
    PluginOption,
    UserConfig,
    ResolvedConfig,
    BuildOptions,
    ServerOptions,
    WatchOptions,
    CSSOptions,
    ESBuildOptions
} from "vite"
import type {RollupOptions, EmittedAsset} from "rollup"
import type {BuildOptions as EsbuildBuildOptions} from "esbuild";
import {BinaryLike, createHash} from "crypto";
import fg from "fast-glob";
import path from "path";
import fs from "fs";

interface ViteWPConfigOptions {
    /* Determines if we're running in dev mode */
    isDev: boolean,
    /* Path to project folder */
    dirname: string,
    /* Project root directory for Vite */
    root: string,
    /* Folder that contains our processed files */
    outDir: string,
    /* Entry folder from out the root */
    entry: boolean | string,
    /* CSS config */
    css: {
        /* Determines if we want to include CSS as entries */
        entries: boolean,
        /* CSS file extension to look for entries */
        extension: string;
    },
    /* Config for asset files that are copied */
    assets: {
        hash: boolean,
        rules: {
            [key: string]: RegExp;
        };
    },
    bundles: {
        banner: string,
        footer: string
    }
}


/**
 * A base ViteJS config for WordPress projects that can be
 * overwritten on the project level
 *
 * @param userOptions
 */
export default function createViteConfig(userOptions?: Partial<ViteWPConfigOptions>): Plugin|PluginOption {

    /**
     * Core plugin options
     */
    const options: ViteWPConfigOptions = {
        ...{
            /* Default options */
            isDev: false,
            root: 'src',
            outDir: `build`,
            entry: false,
            dirname: process.cwd(),
            css: {
                entries: true,
                extension: 'pcss',
            },
            assets: {
                hash: true,
                rules: {
                    images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                    svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                    fonts: /ttf|woff|woff2/i
                }
            },
            bundles: {
                banner: '(function(){',
                footer: '})();'
            }
        },
        ...userOptions
    };

    /**
     * Will be used to collect the resolved configurations
     */
    let ViteConfig: ResolvedConfig;

    /**
     * Plugin hooks
     */
    return {

        /**
         * Plugin name
         */
        name: "vite-wp-config",

        /**
         *  Configuring ViteJS for WordPress development
         *  and making sure it's overwrite-able.
         *
         * @param config
         * @param command
         * @param mode
         */
        config: (config: UserConfig, {command, mode}) => ((() => {

            /**
             * CSS options
             */
            const cssOptions: CSSOptions = {
                postcss: './postcss.config.js',
                devSourcemap: true,
            }

            /**
             * Server options
             */
            const serverOptions: ServerOptions = {
                host: '0.0.0.0',
                port: 3000,
            }

            /**
             * Watch options
             */
            const watchOptions: WatchOptions = {
                usePolling: true
            }

            /**
             * Esbuild options
             */
            const esbuildOptions: ESBuildOptions = {
                loader: "jsx",
                include: new RegExp(`/${options.root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/.*\\.js$`),
                exclude: []
            }

            /**
             * Optimize deps => Esbuild options
             */
            const optimizeDepsEsbuildOptions: EsbuildBuildOptions = {loader: {".js": "jsx"}}

            /**
             * Build options
             */
            const buildOptions: BuildOptions = {
                manifest: true,
                target: 'es2015',
                minify: mode === 'development' ? false : 'esbuild',
                sourcemap: mode === 'development',
                outDir: `../` + options.outDir,
                commonjsOptions: {transformMixedEsModules: true},
            }

            /**
             * Rollup Options
             */
            const rollupOptions: RollupOptions = {
                input: (() => {
                    const scripts = fg.sync(
                        typeof options.entry === 'string'
                            ? path.resolve(options.dirname, options.root, '../', options.root, '**/', options.entry, '*/*.js')
                            : path.resolve(options.dirname, options.root, '*', '*.js')
                    );
                    const styles = fg.sync(
                        typeof options.entry === 'string'
                            ? path.resolve(options.dirname, options.root, '../', options.root, '**/', options.entry, '*/*.' + options.css.extension)
                            : path.resolve(options.dirname, options.root, '*', '*.' + options.css.extension)
                    );
                    return !options.css.entries
                        ? scripts
                        : [...scripts, ...styles];
                })(),
                output: {
                    entryFileNames: (assetInfo: any) => 'js/[name].[hash].js',
                    assetFileNames: (assetInfo: any) => {
                        let extType = assetInfo.name.split('.')[1];
                        return /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)
                            ? 'images/[name][extname]'
                            : extType + '/[name].[hash][extname]';
                    },
                },
            }

            /**
             * Ensuring all options are overwrite-able on the project level.
             */
            config.root = options.root;
            config.server = {
                ...serverOptions,
                ...config.server
            }
            config.server.watch = {
                ...watchOptions,
                ...config.server.watch
            }
            config.css = {
                ...cssOptions,
                ...config.css
            }
            config.esbuild = {
                ...esbuildOptions,
                ...config.esbuild
            }
            if (config.optimizeDeps) {
                config.optimizeDeps.esbuildOptions = {
                    ...optimizeDepsEsbuildOptions,
                    ...config.optimizeDeps.esbuildOptions
                }
            } else {
                config.optimizeDeps = {
                    esbuildOptions: optimizeDepsEsbuildOptions
                }
            }
            config.build = {
                ...buildOptions,
                ...config.build
            }
            config.build.rollupOptions = {
                ...rollupOptions,
                ...config.build.rollupOptions
            }
        })()),

        /**
         * Hook in to get the resolved configurations
         *
         * @param resolvedConfig
         */
        configResolved(resolvedConfig: ResolvedConfig) {
            ViteConfig = resolvedConfig
        },

        /**
         * Hook in to emit our asset files
         */
        async buildStart() {

            /**
             * Create the file hash
             */
            const getFileHash = (file: BinaryLike) => createHash('sha256').update(file).digest('hex').slice(0, 8);

            /**
             * Get the asset files
             */
            const getAssetFiles = (assets: Record<string, string[]> = {}) => {
                const assetFolders = [
                    ...[ViteConfig.root],
                    ...fg.sync(path.resolve(ViteConfig.root, '**/*'), {onlyDirectories: true})
                ];
                for (const assetFolder of assetFolders) {
                    for (const [asset, test] of Object.entries(options.assets.rules)) {
                        if (!(asset in assets)) {
                            assets[asset] = [];
                        }
                        (assets[asset] = [...assets[asset], ...fg.sync(path.resolve(assetFolder, asset, '**/*'))])
                    }
                }

                return assets
            }

            /**
             * Loop the asset files and emit the ones we want
             */
            for (const [type, asset] of Object.entries(getAssetFiles())) {

                asset.map((asset) => {
                    const file = asset.split('/' + type + '/')[1];
                    const filePath = asset.split(ViteConfig.root + '/')[1];
                    const fileLastDotIndex = file.lastIndexOf(".");
                    const fileExt = file.substring(fileLastDotIndex + 1);
                    const fileName = file.substring(0, fileLastDotIndex);

                    if (fileExt === '') {
                        return;
                    }

                    if (options.assets.rules[type].test(fileExt)) {
                        const emittedAsset: EmittedAsset = {
                            type: 'asset',
                            fileName: options.assets.hash
                                ? type + '/' + fileName + '.' + getFileHash(file) + '.' + fileExt
                                : type + '/' + fileName + '.' + fileExt,
                            source: fs.readFileSync(asset),
                            name: filePath
                        }
                        this.emitFile(emittedAsset);
                    }
                })
            }
        },

        /**
         * Encapsulate bundles
         *
         * @param bundleOptions
         * @param bundle
         */
        generateBundle(bundleOptions, bundle) {

            for (const module of Object.values(bundle)) {

                if (module.type === 'chunk') {
                    module.code = options.bundles.banner + module.code + options.bundles.footer
                }
            }
        },

        /**
         * Handle hot update for PHP
         *
         * @param file
         * @param server
         */
        handleHotUpdate({file, server}) {
            if (file.endsWith(".php")) {
                server.ws.send({type: 'full-reload', path: "*"});
            }
        },
    };
}