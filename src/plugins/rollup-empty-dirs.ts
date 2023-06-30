import type {PluginOption} from 'vite'
import path from "path";
import fs from "fs";

interface RollupEmptyDirsConfig {
    dirname: string;
    buildPath: string;
    emptyDirs: string[];
}

/**
 * A custom RollUpJS plugin which will empty our specified build folders
 * before our new bundles get build as replacement to "emptyOutDir"
 *
 * @param userRollupEmptyDirsConfig
 */
export default function (userRollupEmptyDirsConfig?: Partial<RollupEmptyDirsConfig>): PluginOption {
    const config = {
        ...{
            dirname: '',
            buildPath: '',
            emptyDirs: ['css', 'js', 'svg', 'images', 'fonts'],
        },
        ...userRollupEmptyDirsConfig
    };

    return {
        name: 'rollup-empty-dirs',
        async buildStart() {
            for (const dir of config.emptyDirs) {
                await ((dirPath) => {
                    if (fs.existsSync(dirPath)) {
                        fs.rmSync(dirPath, {recursive: true});
                        console.log('deleted ' + dirPath)
                    }
                })(path.resolve(path.resolve(config.dirname, config.buildPath), dir))
            }
        },
    };
}