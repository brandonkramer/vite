import fg from "fast-glob";
import path from "path";
import fs from "fs";

export default function rollupCopyAssetFiles(
    resolvePath,
    testRules = {
        images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
        svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
        fonts: /ttf|woff|woff2/i
    }) {
    return {
        name: 'viteCopyAssetFiles',
        async buildStart() {

            /** Collect assets */
            const collectAssets = (assets = {}) => {
                for (const assetFolder of fg.sync(path.resolve(resolvePath.dirname, resolvePath.path), {onlyFiles: false})) {
                    for (const [asset, test] of Object.entries(testRules)) {
                        if (!(asset in assets)) {
                            assets[asset] = [];
                        }
                        (assets[asset] = [...assets[asset], ...fg.sync(path.resolve(assetFolder, asset + '/**/*'))])
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


                    if (testRules[type] !== false && testRules[type].test(fileExt)) {

                        this.emitFile({
                            type: 'asset',
                            fileName: type + '/' + file,
                            source: fs.readFileSync(asset)
                        });
                    }
                })
            }
        }
    }
}