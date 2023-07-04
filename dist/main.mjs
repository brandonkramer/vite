import { createHash as b } from "crypto";
import r from "path";
import m from "fs";
import l from "fast-glob";
function D(t) {
  const e = {
    banner: "(function(){",
    footer: "})();",
    ...t
  };
  return {
    name: "rollup-encapsulate-bundles",
    generateBundle(s, o) {
      for (const i of Object.values(o))
        i.type === "chunk" && (i.code = e.banner + i.code + e.footer);
    }
  };
}
function O(t) {
  let e;
  const s = {
    hash: !0,
    rules: {
      images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
      svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
      fonts: /ttf|woff|woff2/i
    },
    ...t
  };
  return {
    name: "rollup-copy-asset-files",
    /**
     * Hook in to get the resolved configurations
     * @param resolvedConfig
     */
    configResolved(o) {
      e = o;
    },
    /**
     * Hook in to emit our asset files
     */
    async buildStart() {
      const o = (n) => b("sha256").update(n).digest("hex").slice(0, 8), i = (n = {}) => {
        const c = [
          e.root,
          ...l.sync(r.resolve(e.root, "**/*"), { onlyDirectories: !0 })
        ];
        for (const p of c)
          for (const [a, d] of Object.entries(s.rules))
            a in n || (n[a] = []), n[a] = [...n[a], ...l.sync(r.resolve(p, a, "**/*"))];
        return n;
      };
      for (const [n, c] of Object.entries(i()))
        c.map((p) => {
          const a = p.split("/" + n + "/")[1], d = p.split(e.root + "/")[1], f = a.lastIndexOf("."), u = a.substring(f + 1), y = a.substring(0, f);
          if (u !== "" && s.rules[n].test(u)) {
            const g = {
              type: "asset",
              fileName: s.hash ? n + "/" + y + "." + o(a) + "." + u : n + "/" + y + "." + u,
              source: m.readFileSync(p),
              name: d
            };
            this.emitFile(g);
          }
        });
    }
  };
}
function k(t) {
  const e = {
    dirname: "",
    buildPath: "",
    emptyDirs: ["css", "js", "svg", "images", "fonts"],
    ...t
  };
  return {
    name: "rollup-empty-dirs",
    async buildStart() {
      for (const s of e.emptyDirs)
        await ((o) => {
          m.existsSync(o) && (m.rmSync(o, { recursive: !0 }), console.log("deleted " + o));
        })(r.resolve(e.dirname, e.buildPath, s));
    }
  };
}
function E(t) {
  const e = {
    path: "*",
    ...t
  };
  return {
    name: "vite-handle-hot-update",
    handleHotUpdate({ file: s, server: o }) {
      s.endsWith(".php") && o.ws.send({ type: "full-reload", path: e.path });
    }
  };
}
function F(t) {
  const e = {
    /* Default options */
    isDev: !1,
    root: "src",
    outDir: "build",
    entry: !1,
    dirname: "",
    css: {
      entries: !0,
      extension: "pcss"
    },
    ...t
  }, s = {
    /* Shared options */
    root: e.root,
    /* Server Options */
    server: {
      host: "0.0.0.0",
      port: 3e3,
      watch: {
        usePolling: !0
      }
    },
    /* CSS Options */
    css: {
      postcss: "./postcss.config.js",
      devSourcemap: !0
    },
    /* Esbuild Options */
    esbuild: {
      loader: "jsx",
      include: new RegExp(`/${e.root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/.*\\.js$`),
      exclude: []
    },
    /* OptimizeDEps Options */
    optimizeDeps: {
      esbuildOptions: { loader: { ".js": "jsx" } }
    },
    /* Build options */
    build: {
      manifest: !0,
      target: "es2015",
      minify: e.isDev ? !1 : "esbuild",
      sourcemap: e.isDev,
      outDir: "../" + e.outDir,
      commonjsOptions: { transformMixedEsModules: !0 },
      /* RollupJS options */
      rollupOptions: {
        input: (() => {
          const o = l.sync(typeof e.entry == "string" ? r.resolve(e.dirname, e.root, "../", e.root, "**/", e.entry, "*/*.js") : r.resolve(e.dirname, e.root, "*", "*.js")), i = l.sync(typeof e.entry == "string" ? r.resolve(e.dirname, e.root, "../", e.root, "**/", e.entry, "*/*." + e.css.extension) : r.resolve(e.dirname, e.root, "*", "*." + e.css.extension));
          return e.css.entries ? [...o, ...i] : o;
        })(),
        output: {
          entryFileNames: (o) => "js/[name].[hash].js",
          assetFileNames: (o) => {
            let i = o.name.split(".")[1];
            return /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(i) ? "images/[name][extname]" : i + "/[name].[hash][extname]";
          }
        }
      }
    }
  };
  return {
    name: "vite-config-base",
    config() {
      return s;
    }
  };
}
function h(t) {
  return t.replace(/-([a-z])/g, (e, s) => s.toUpperCase());
}
function C() {
  return {
    ...{
      jquery: "jQuery",
      tinymce: "tinymce",
      moment: "moment",
      react: "React",
      "react-dom": "ReactDOM",
      backbone: "Backbone",
      lodash: "lodash"
    },
    ...Object.fromEntries([
      "a11y",
      "annotations",
      "api-fetch",
      "autop",
      "blob",
      "block-directory",
      "block-editor",
      "block-library",
      "block-serialization-default-parser",
      "blocks",
      "components",
      "compose",
      "core-data",
      "data",
      "data-controls",
      "date",
      "deprecated",
      "dom",
      "dom-ready",
      "edit-post",
      "editor",
      "element",
      "escape-html",
      "format-library",
      "hooks",
      "html-entities",
      "i18n",
      "is-shallow-equal",
      "keyboard-shortcuts",
      "keycodes",
      "list-reusable-blocks",
      "media-utils",
      "notices",
      "nux",
      "plugins",
      "primitives",
      "priority-queue",
      "redux-routine",
      "reusable-blocks",
      "rich-text",
      "server-side-render",
      "shortcode",
      "token-list",
      "url",
      "viewport",
      "warning",
      "wordcount"
    ].map((s) => [`@wordpress/${s}`, `wp.${h(s)}`]))
  };
}
const $ = (t) => ({
  /* Shared options */
  root: t.root,
  /* Server Options */
  server: {
    host: "0.0.0.0",
    port: 3e3,
    watch: {
      usePolling: !0
    }
  },
  /* CSS Options */
  css: {
    postcss: "./postcss.config.js",
    devSourcemap: !0
  },
  /* Esbuild Options */
  esbuild: {
    loader: "jsx",
    include: new RegExp(`/${t.root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/.*\\.js$`),
    exclude: []
  },
  /* OptimizeDEps Options */
  optimizeDeps: {
    esbuildOptions: { loader: { ".js": "jsx" } }
  },
  /* Build options */
  build: {
    manifest: !0,
    target: "es2015",
    minify: t.isDev ? !1 : "esbuild",
    sourcemap: t.isDev,
    outDir: "../" + t.outDir,
    commonjsOptions: { transformMixedEsModules: !0 },
    /* RollupJS options */
    rollupOptions: {
      input: (() => {
        const e = l.sync(t.hasOwnProperty("entry") ? r.resolve(t.dirname, t.root, "../", t.root, "**/", t.entry, "*/*.js") : r.resolve(t.dirname, t.root, "*", "*.js")), s = t.hasOwnProperty("cssExtension") ? t.cssExtension : "pcss", o = l.sync(t.hasOwnProperty("entry") ? r.resolve(t.dirname, t.root, "../", t.root, "**/", t.entry, "*/*." + s) : r.resolve(t.dirname, t.root, "*", "*." + s));
        return t.hasOwnProperty("cssEntries") && !t.cssEntries ? e : [...e, ...o];
      })(),
      output: {
        entryFileNames: (e) => "js/[name].[hash].js",
        assetFileNames: (e) => {
          let s = e.name.split(".")[1];
          return /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(s) ? "images/[name][extname]" : s + "/[name].[hash][extname]";
        }
      }
    }
  }
});
export {
  $ as baseConfig,
  h as kebabToCamelCase,
  O as rollUpCopyAssets,
  k as rollupEmptyDirs,
  D as rollupEncapsulateBundles,
  F as viteConfigBase,
  E as viteHandleHotUpdate,
  C as wpGlobals
};
