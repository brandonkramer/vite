import * as esbuild from "esbuild";
import fg from "fast-glob";
import path from "path";

interface WPStrapViteConfigCore {
    root: string;
    isDev: boolean;
    entry: string,
    outDir: string;
    dirname: string
}

interface WPStrapViteConfigServerOptions {
    host: string;
    port: number;
    watch: {
        usePolling: boolean;
    };
}

interface WPStrapViteConfigCSSOptions {
    postcss: string;
}

interface WPStrapViteConfigEsbuildOptions {
    loader: string;
    include: RegExp;
    exclude: any[]; // Update with appropriate type if possible
}

interface WPStrapViteConfigOptimizeDepsOptions {
    esbuildOptions: {
        loader: {
            [key: string]: string;
        };
    };
}

interface WPStrapViteConfigRollupOptions {
    input: string | string[],
    output: {
        entryFileNames: (assetInfo: any) => string;
        assetFileNames: (assetInfo: any) => string;
    };
}

/**
 * A base ViteJS config for WordPress projects that can be
 * overwritten on the project level
 *
 * @param core
 */
export default (core: WPStrapViteConfigCore) => ({
    /* Shared options */
    root: core.root,

    /* Server Options */
    server: {
        host: '0.0.0.0',
        port: 3000,
        watch: {
            usePolling: true
        }
    } as WPStrapViteConfigServerOptions,

    /* CSS Options */
    css: {
        postcss: './postcss.config.js'
    } as WPStrapViteConfigCSSOptions,

    /* Esbuild Options */
    esbuild: {
        loader: "jsx",
        include: new RegExp(`/${core.root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/.*\\.js$`),
        exclude: []
    } as WPStrapViteConfigEsbuildOptions,

    /* OptimizeDEps Options */
    optimizeDeps: {
        esbuildOptions: {loader: {".js": "jsx"}},
    } as WPStrapViteConfigOptimizeDepsOptions,

    /* Build options */
    build: {
        manifest: true,
        target: 'es2015',
        minify: core.isDev ? false : 'esbuild',
        sourcemap: core.isDev,
        outDir: `../` + core.outDir,
        commonjsOptions: {transformMixedEsModules: true},

        /* RollupJS options */
        rollupOptions: {
            input: fg.sync(core.hasOwnProperty('entry')
                ? path.resolve(core.dirname, core.root, '../', core.root, '**/', core.entry, 'js/*')
                : path.resolve(core.dirname, core.root, '*', '*.js')),
            output: {
                entryFileNames: (assetInfo: any) => 'js/[name].[hash].js',
                assetFileNames: (assetInfo: any) => {
                    let extType = assetInfo.name.split('.')[1];
                    return /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)
                        ? 'images/[name][extname]'
                        : extType + '/[name].[hash][extname]';
                },
            },
        } as WPStrapViteConfigRollupOptions,
    },
});