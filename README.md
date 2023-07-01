<div align="center">
  <a href="https://vitejs.dev/">
    <img width="200" height="200" hspace="10" src="https://vitejs.dev/logo.svg" alt="vite logo" />
  </a>
  <h1>Vite</h1>
  <p>
A collection of front-end utilities for WordPress development with ViteJS.

You can read more about ViteJS on [vitejs.dev](https://vitejs.dev)
</p>
</div>


## Usages

Install dependency into your project.
```
yarn add -D @wp-strap/vite
```

Add plugins into your Vite config file.
```JS
import {viteHandleHotUpdate, rollUpCopyAssets, rollupEncapsulateBundles} from '@wp-strap/vite';
import path from "path";

export default defineConfig(() => ({

    plugins: [
        /**
         * Add this custom plugin to automatically recompile the assets and refresh
         * your browser when editing PHP files.
         */
        viteHandleHotUpdate()
    ],

    build: {

        rollupOptions: {

            plugins: [
                /**
                 * Add this custom RollUpJS plugin to encapsulate bundles
                 */
                rollupEncapsulateBundles(),

                /**
                 * Add this custom RollUpJS plugin which will emit all our asset files
                 */
                rollUpCopyAssets(path.resolve(__dirname, '**relative path to root folder**'), {
                    rules: {
                        images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                        svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                        fonts: /ttf|woff|woff2/i
                    }
                }),
            ],
        },
    },

}));
```

Or extend an opinionated config for WP development to minimise your configurations.
```JS
import {defineConfig} from 'vite'
import * as WPStrap from '@wp-strap/vite';
import path from "path";

export default defineConfig(({command, mode}, core = {
    isDev: mode === 'development', /* Determines if the task runner is in dev mode */
    root: 'src',  /* Project root directory */
    outDir: `build`, /* Folder that contains our processed files */
    dirname: __dirname
}) => ({
    ...WPStrap.baseConfig(core), ...{

        /* Build Options */
        build: {
            ...WPStrap.baseConfig(core).build, ...{

                /* RollupJS Options */
                rollupOptions: {
                    ...WPStrap.baseConfig(core).build.rollupOptions, ...{

                        /* RollupJS plugins */
                        plugins: [
                            WPStrap.rollupEncapsulateBundles(),
                            WPStrap.rollUpCopyAssets(path.resolve(core.dirname, core.root)),
                        ],
                    }
                },
            }
        },

        /* ViteJS plugins */
        plugins: [WPStrap.viteHandleHotUpdate()],
    }
}));
```

You can find a project example here: https://github.com/wp-strap/wp-vite-starter