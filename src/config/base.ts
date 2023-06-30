import * as esbuild from "esbuild";

interface Core {
    root: string;
    isDev: boolean;
    outDir: string;
}

interface ServerOptions {
    host: string;
    port: number;
    watch: {
        usePolling: boolean;
    };
}

interface CSSOptions {
    postcss: string;
}

interface EsbuildOptions {
    loader: string;
    include: RegExp;
    exclude: any[]; // Update with appropriate type if possible
}

interface OptimizeDepsOptions {
    esbuildOptions: {
        loader: {
            [key: string]: string;
        };
    };
}

interface RollupOptions {
    output: {
        entryFileNames: (assetInfo: any) => string;
        assetFileNames: (assetInfo: any) => string;
    };
}

/**
 * A base config that can be overwritten on the project level
 *
 * @param core
 */
export default (core: Core) => ({
    /* Shared options */
    root: core.root,

    /* Server Options */
    server: {
        host: '0.0.0.0',
        port: 3000,
        watch: {
            usePolling: true
        }
    } as ServerOptions,

    /* CSS Options */
    css: {
        postcss: './.dev/postcss.config.js'
    } as CSSOptions,

    /* Esbuild Options */
    esbuild: {
        loader: "jsx",
        include: /\/src\/.*\.js$/,
        exclude: []
    } as EsbuildOptions,

    /* OptimizeDEps Options */
    optimizeDeps: {
        esbuildOptions: {loader: {".js": "jsx"}},
    } as OptimizeDepsOptions,

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
            output: {
                entryFileNames: (assetInfo: any) => 'js/[name].[hash].js',
                assetFileNames: (assetInfo: any) => {
                    let extType = assetInfo.name.split('.')[1];
                    return /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)
                        ? 'images/[name][extname]'
                        : extType + '/[name].[hash][extname]';
                },
            },
        } as RollupOptions,
    },
});