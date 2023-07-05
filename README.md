<div align="center">
  <a href="https://vitejs.dev/">
    <img width="200" height="200" hspace="10" src="https://vitejs.dev/logo.svg" alt="vite logo" />
  </a>
  <h1>Vite</h1>
  <p>
A library of front-end utilities for WordPress development with ViteJS.

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
import {viteHandleHotUpdate, viteCopyAssetFiles, viteEncapsulateBundles} from '@wp-strap/vite';

export default defineConfig({
    
    plugins: [
        
        /**
         * Add this custom RollUpJS plugin to encapsulate bundles to prevent mix-up of
         * global variables after minification
         */
        viteEncapsulateBundles(),

        /**
         * Add this custom RollUpJS plugin which will emit all our asset files and make them
         * transformable by Vite/vite plugins
         */
        viteCopyAssetFiles(),
        
        /**
         * Add this custom plugin to automatically recompile the assets and refresh
         * your browser when editing PHP files.
         */
        viteHandleHotUpdate()
    ],
});
```

Or extend an opinionated config that includes these plugins and other (overwrite-able) configurations for WP development. 
```JS
import {viteWPConfig} from '@wp-strap/vite';

export default defineConfig({

    plugins: [viteWPConfig()], 
});
```

### viteWPConfig 

The plugin ensures the following:

- Updates/refreshes the dev server (HMR/Hot Module Replacement) when a change is made inside PHP files
- Encapsulates JS bundles to prevent mix-up of global variables (with other plugins/themes) after minification
- Collects images, SVG and font files from folders and emits them to make them transformable by plugins
- Esbuild is configured to make ReactJS code work inside `.js` files instead of the default `.jsx`
- Esbuild for minification which is turned off for `development` mode
- Esbuild sourcemaps are added for `development` mode
- JS entries are automatically included from first-level folders inside the `src` folder using fast-glob (e.g., js/my-script.js, blocks/my-block.js).
- CSS entries are also automatically included in the same way, bundled and compiled without importing them into JS files which is more suitable for WordPress projects.


### viteCopyAssetFiles

With the `viteCopyAssetFiles` userOptions param you're able to add additional asset folders by adding additional test rules aside to images/svg/fonts, and you can customize the default ones as well:
```js
viteCopyAssetFiles({
    rules: {
        images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
        svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
        fonts: /ttf|woff|woff2/i
    }
})

// or 

viteWPConfig({
    assets: {
        rules: {
            images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
            svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
            fonts: /ttf|woff|woff2/i
        }
    }
})
```
### viteEncapsulateBundles
You can customize the way it encapsulates bundles by using the userOptions param in `viteEncapsulateBundles`:
```js
viteEncapsulateBundles({
    banner: '/*My Custom Project*/(function(){', // Adds a comment before each bundle
    footer: '})();'
})

// or

viteWPConfig({
    bundles: {
        banner: '/*My Custom Project*/(function(){', // Adds a comment before each bundle
        footer: '})();'
    }
})
```

----

You can find more info and a project example here: https://github.com/wp-strap/wp-vite-starter