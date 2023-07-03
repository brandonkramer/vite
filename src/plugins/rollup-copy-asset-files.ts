import type {PluginOption} from 'vite'
import type {EmittedAsset} from 'rollup';
import {BinaryLike, createHash} from 'crypto';
import path from "path";
import fs from "fs";
import fg from "fast-glob";

export interface RollupCopyAssetFilesOptions {
    rules: {
        [key: string]: RegExp;
    };
}

/**
 * A custom RollUpJS plugin which will emit all our asset files
 *
 * @param userPath
 * @param userOptions
 */
export default function (userPath: string, userOptions?: Partial<RollupCopyAssetFilesOptions>): PluginOption {
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
        async buildStart() {
            const createFileHash = (file: BinaryLike) => createHash('sha256').update(file).digest('hex').slice(0, 8);
            const collectAssets = (assets: Record<string, string[]> = {}) => {
                for (const assetFolder of fg.sync(userPath, {onlyFiles: false})) {
                    for (const [asset, test] of Object.entries(options.rules)) {
                        if (!(asset in assets)) {
                            assets[asset] = [];
                        }
                        (assets[asset] = [...assets[asset], ...fg.sync(path.resolve(assetFolder, asset, '**/*'))])
                    }
                }

                return assets
            }

            for (const [type, asset] of Object.entries(collectAssets())) {
                asset.map((asset) => {
                    const file = asset.split('/' + type + '/')[1];
                    const fileExt = file.split('.')[1];
                    const fileName = file.replace(fileExt, '');
                    const filePath = asset.split(userPath + '/')[1];

                    if (fileExt === '') {
                        return;
                    }


                    if (options.rules[type].test(fileExt)) {
                        const emittedAsset: EmittedAsset = {
                            type: 'asset',
                            fileName: options.hash
                                ? type + '/' + fileName + createFileHash(file) + '.' + fileExt
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