interface WPStrapViteConfigCore {
    isDev: boolean;
    root: string;
    entry: string;
    outDir: string;
    dirname: string;
    cssEntries: boolean;
    cssExtension: string;
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
    devSourcemap: boolean;
}
interface WPStrapViteConfigEsbuildOptions {
    loader: string;
    include: RegExp;
    exclude: any[];
}
interface WPStrapViteConfigOptimizeDepsOptions {
    esbuildOptions: {
        loader: {
            [key: string]: string;
        };
    };
}
interface WPStrapViteConfigRollupOptions {
    input: string | string[];
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
declare const _default: (core: WPStrapViteConfigCore) => {
    root: string;
    server: WPStrapViteConfigServerOptions;
    css: WPStrapViteConfigCSSOptions;
    esbuild: WPStrapViteConfigEsbuildOptions;
    optimizeDeps: WPStrapViteConfigOptimizeDepsOptions;
    build: {
        manifest: boolean;
        target: string;
        minify: string | boolean;
        sourcemap: boolean;
        outDir: string;
        commonjsOptions: {
            transformMixedEsModules: boolean;
        };
        rollupOptions: WPStrapViteConfigRollupOptions;
    };
};
export default _default;
