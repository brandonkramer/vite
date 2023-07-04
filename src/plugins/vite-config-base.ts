import {Plugin, UserConfig} from "vite"
import * as esbuild from "esbuild";
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
    entry: boolean|string,
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
            dirname: '',
            css: {
                entries: true,
                extension: 'pcss',
            }
        },
        ...userOptions
    };

    const viteConfig: UserConfig = {
        /* Shared options */
        root: options.root,

        /* Server Options */
        server: {
            host: '0.0.0.0',
            port: 3000,
            watch: {
                usePolling: true
            }
        },
        /* CSS Options */
        css: {
            postcss: './postcss.config.js',
            devSourcemap: true,
        },

        /* Esbuild Options */
        esbuild: {
            loader: "jsx",
            include: new RegExp(`/${options.root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/.*\\.js$`),
            exclude: []
        },

        /* OptimizeDEps Options */
        optimizeDeps: {
            esbuildOptions: {loader: {".js": "jsx"}},
        },

        /* Build options */
        build: {
            manifest: true,
            target: 'es2015',
            minify: options.isDev ? false : 'esbuild',
            sourcemap: options.isDev,
            outDir: `../` + options.outDir,
            commonjsOptions: {transformMixedEsModules: true},

            /* RollupJS options */
            rollupOptions: {
                input: (() => {
                    const scripts = fg.sync(
                        typeof  options.entry === 'string'
                            ? path.resolve(options.dirname, options.root, '../', options.root, '**/', options.entry, '*/*.js')
                            : path.resolve(options.dirname, options.root, '*', '*.js')
                    );
                    const styles = fg.sync(
                        typeof  options.entry === 'string'
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
        }
    };

    return {
        name: "vite-config-base",
        config() {
            return viteConfig;
        }
    };
}