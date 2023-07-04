import type { PluginOption } from 'vite';
export interface RollupCopyAssetFilesOptions {
    hash: boolean;
    rules: {
        [key: string]: RegExp;
    };
}
/**
 * A custom RollUpJS plugin which will emit all our asset files
 *
 * @param userOptions
 */
export default function (userOptions?: Partial<RollupCopyAssetFilesOptions>): PluginOption;
