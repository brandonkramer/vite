import type { PluginOption } from 'vite';
interface RollupEmptyDirsOptions {
    dirname: string;
    buildPath: string;
    emptyDirs: string[];
}
/**
 * A custom RollUpJS plugin which will empty our specified build folders
 * before our new bundles get build as replacement to "emptyOutDir"
 *
 * @param userOptions
 */
export default function (userOptions?: Partial<RollupEmptyDirsOptions>): PluginOption;
export {};
