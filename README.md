<div align="center">
  <a href="https://vitejs.dev/">
    <img width="200" height="200" hspace="10" src="https://vitejs.dev/logo.svg" alt="vite logo" />
  </a>
  <h1>Vite</h1>
  <p>
A collection of utilities for WordPress development with ViteJS.

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
