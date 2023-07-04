import { Plugin } from "vite";
interface ViteConfigBaseOptions {
    isDev: boolean;
    dirname: string;
    root: string;
    outDir: string;
    entry: boolean | string;
    css: {
        entries: boolean;
        extension: string;
    };
}
/**
 * A base ViteJS config for WordPress projects that can be
 * overwritten on the project level
 *
 * @param userOptions
 */
export default function createViteConfig(userOptions?: Partial<ViteConfigBaseOptions>): Plugin;
export {};
