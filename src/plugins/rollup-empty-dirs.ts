import type {PluginOption} from 'vite'
import path from "path";
import fs from "fs";

interface Config {
    dirname: string;
    buildPath: string;
    emptyDirs: string[];
}

const DEFAULT_CONFIG: Config = {
    dirname: '',
    buildPath: '',
    emptyDirs: ['css', 'js', 'svg', 'images', 'fonts'],
};

/**
 * A custom RollUpJS plugin which will empty our specified build folders
 * before our new bundles get build as replacement to "emptyOutDir"
 *
 * @param userConfig
 */
export default function (userConfig?: Partial<Config>): PluginOption {
    const config = {
        ...DEFAULT_CONFIG,
        ...userConfig
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