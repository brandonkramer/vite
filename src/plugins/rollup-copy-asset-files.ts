import type {PluginOption} from 'vite'
import fg from "fast-glob";
import path from "path";
import fs from "fs";

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

            /** Collect assets */
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

            /* Test and emit */
            for (const [type, asset] of Object.entries(collectAssets())) {
                asset.map((asset) => {
                    const file = asset.split('/' + type + '/')[1];
                    const fileExt = file.split('.')[1];

                    if (fileExt === undefined) {
                        return;
                    }


                    if (options.rules[type].test(fileExt)) {

                        this.emitFile({
                            type: 'asset',
                            fileName: type + '/' + file,
                            source: fs.readFileSync(asset)
                        });
                    }
                })
            }
        }
    };
}