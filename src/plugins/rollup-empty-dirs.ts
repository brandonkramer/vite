import type {PluginOption} from 'vite'
import path from "path";
import fs from "fs";

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
export default function (userOptions?: Partial<RollupEmptyDirsOptions>): PluginOption {
    const options = {
        ...{
            dirname: '',
            buildPath: '',
            emptyDirs: ['css', 'js', 'svg', 'images', 'fonts'],
        },
        ...userOptions
    };

    return {
        name: 'rollup-empty-dirs',
        async buildStart() {
            for (const dir of options.emptyDirs) {
                await ((dirPath) => {
                    if (fs.existsSync(dirPath)) {
                        fs.rmSync(dirPath, {recursive: true});
                        console.log('deleted ' + dirPath)
                    }
                })(path.resolve(options.dirname, options.buildPath, dir))
            }
        },
    };
}