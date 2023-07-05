import type {PluginOption} from 'vite'
import path from "path";
import fs from "fs";

interface ViteEmptyDirsOptions {
    dirname: string;
    buildPath: string;
    emptyDirs: string[];
}

/**
 * A custom ViteJS plugin which will empty our specified build folders
 * before our new bundles get build as replacement to "emptyOutDir"
 *
 * @param userOptions
 */
export default function (userOptions?: Partial<ViteEmptyDirsOptions>): PluginOption {

    /**
     * Core plugin options
     */
    const options = {
        ...{
            dirname: '',
            buildPath: '',
            emptyDirs: ['css', 'js', 'svg', 'images', 'fonts'],
        },
        ...userOptions
    };

    /**
     * Plugin hooks
     */
    return {

        /**
         * Plugin name
         */
        name: 'vite-empty-dirs',

        /**
         * Plugin hook
         */
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