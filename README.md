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

export default defineConfig({

    build: {

        rollupOptions: {

            plugins: [
                /**
                 * Add this custom RollUpJS plugin to encapsulate bundles to prevent mix-up of
                 * global variables after minification
                 */
                rollupEncapsulateBundles(),

                /**
                 * Add this custom RollUpJS plugin which will emit all our asset files and make them
                 * transformable by Vite/Rollup plugins
                 */
                rollUpCopyAssets({
                    rules: {
                        images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                        svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
                        fonts: /ttf|woff|woff2/i
                    }
                }),
            ],
        },
    },

    plugins: [
        /**
         * Add this custom plugin to automatically recompile the assets and refresh
         * your browser when editing PHP files.
         */
        viteHandleHotUpdate()
    ],
};
```

Or extend an opinionated config for WP development to minimise your configurations.
```JS
import {defineConfig} from 'vite'
import * as WPStrap from '@wp-strap/vite';

export default defineConfig({

    /* ViteJS plugins */
    plugins: [WPStrap.viteConfigBase()], // <------

    /* Build options */
    build: {

        /* RollupJS options */
        rollupOptions: {

            /* RollupJS plugins */
            plugins: [WPStrap.rollupEncapsulateBundles(), WPStrap.rollUpCopyAssets()],
        },
    },
});
```


You can find more info and a project example here: https://github.com/wp-strap/wp-vite-starter