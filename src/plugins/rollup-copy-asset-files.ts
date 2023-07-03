import type {PluginOption, ResolvedConfig} from 'vite'
import type {EmittedAsset} from 'rollup';
import {BinaryLike, createHash} from 'crypto';
import path from "path";
import fs from "fs";
import fg from "fast-glob";

export interface RollupCopyAssetFilesOptions {
    hash: boolean,
    rules: {
        [key: string]: RegExp;
    };
}

/**
 * A custom RollUpJS plugin which will emit all our asset files
 *
 * @param userOptions
 */
export default function ( userOptions?: Partial<RollupCopyAssetFilesOptions>): PluginOption {
   let ViteConfig: ResolvedConfig;
    const options = {
        ...{
            hash: true,
            rules: {
                images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                fonts: /ttf|woff|woff2/i
            }
        },
        ...userOptions
    };

    return {
        name: 'rollup-copy-asset-files',

        /**
         * Hook in to get the resolved configurations
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
                    for (const [asset, test] of Object.entries(options.rules)) {
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


                    if (options.rules[type].test(fileExt)) {
                        const emittedAsset: EmittedAsset = {
                            type: 'asset',
                            fileName: options.hash
                                ? type + '/' + fileName + '.' + getFileHash(file) + '.' + fileExt
                                : type + '/' + fileName + '.' + fileExt,
                            source: fs.readFileSync(asset),
                            name: filePath
                        }
                        this.emitFile(emittedAsset);
                    }
                })
            }
        }
    };
}