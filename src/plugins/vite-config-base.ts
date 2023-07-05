import type {BuildOptions, Plugin, UserConfig, ServerOptions, WatchOptions, CSSOptions, ESBuildOptions} from "vite"
import type {RollupOptions} from "rollup"
import type {BuildOptions as EsbuildBuildOptions} from "esbuild";
import fg from "fast-glob";
import path from "path";

interface ViteConfigBaseOptions {
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
}


/**
 * A base ViteJS config for WordPress projects that can be
 * overwritten on the project level
 *
 * @param userOptions
 */
export default function createViteConfig(userOptions?: Partial<ViteConfigBaseOptions>): Plugin {

    const options: ViteConfigBaseOptions = {
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
            }
        },
        ...userOptions
    };

    return {
        name: "vite-config-base",
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