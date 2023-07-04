import { createHash as b } from "crypto";
import r from "path";
import m from "fs";
import p from "fast-glob";
function O(t) {
  const e = {
    banner: "(function(){",
    footer: "})();",
    ...t
  };
  return {
    name: "rollup-encapsulate-bundles",
    generateBundle(s, n) {
      for (const a of Object.values(n))
        a.type === "chunk" && (a.code = e.banner + a.code + e.footer);
    }
  };
}
function D(t) {
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
    configResolved(n) {
      e = n;
    },
    /**
     * Hook in to emit our asset files
     */
    async buildStart() {
      const n = (o) => b("sha256").update(o).digest("hex").slice(0, 8), a = (o = {}) => {
        const l = [
          e.root,
          ...p.sync(r.resolve(e.root, "**/*"), { onlyDirectories: !0 })
        ];
        for (const c of l)
          for (const [i, d] of Object.entries(s.rules))
            i in o || (o[i] = []), o[i] = [...o[i], ...p.sync(r.resolve(c, i, "**/*"))];
        return o;
      };
      for (const [o, l] of Object.entries(a()))
        l.map((c) => {
          const i = c.split("/" + o + "/")[1], d = c.split(e.root + "/")[1], f = i.lastIndexOf("."), u = i.substring(f + 1), y = i.substring(0, f);
          if (u !== "" && s.rules[o].test(u)) {
            const g = {
              type: "asset",
              fileName: s.hash ? o + "/" + y + "." + n(i) + "." + u : o + "/" + y + "." + u,
              source: m.readFileSync(c),
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
        await ((n) => {
          m.existsSync(n) && (m.rmSync(n, { recursive: !0 }), console.log("deleted " + n));
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
    handleHotUpdate({ file: s, server: n }) {
      s.endsWith(".php") && n.ws.send({ type: "full-reload", path: e.path });
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
    dirname: process.cwd(),
    css: {
      entries: !0,
      extension: "pcss"
    },
    ...t
  };
  return {
    name: "vite-config-base",
    config: (s, { command: n, mode: a }) => ({
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
        minify: a === "development" ? !1 : "esbuild",
        sourcemap: a === "development",
        outDir: "../" + e.outDir,
        commonjsOptions: { transformMixedEsModules: !0 },
        /* RollupJS options */
        rollupOptions: {
          input: (() => {
            const o = p.sync(typeof e.entry == "string" ? r.resolve(e.dirname, e.root, "../", e.root, "**/", e.entry, "*/*.js") : r.resolve(e.dirname, e.root, "*", "*.js")), l = p.sync(typeof e.entry == "string" ? r.resolve(e.dirname, e.root, "../", e.root, "**/", e.entry, "*/*." + e.css.extension) : r.resolve(e.dirname, e.root, "*", "*." + e.css.extension));
            return e.css.entries ? [...o, ...l] : o;
          })(),
          output: {
            entryFileNames: (o) => "js/[name].[hash].js",
            assetFileNames: (o) => {
              let l = o.name.split(".")[1];
              return /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(l) ? "images/[name][extname]" : l + "/[name].[hash][extname]";
            }
          }
        }
      }
    })
  };
}
function h(t) {
  return t.replace(/-([a-z])/g, (e, s) => s.toUpperCase());
}
function $() {
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
const C = (t) => ({
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
        const e = p.sync(t.hasOwnProperty("entry") ? r.resolve(t.dirname, t.root, "../", t.root, "**/", t.entry, "*/*.js") : r.resolve(t.dirname, t.root, "*", "*.js")), s = t.hasOwnProperty("cssExtension") ? t.cssExtension : "pcss", n = p.sync(t.hasOwnProperty("entry") ? r.resolve(t.dirname, t.root, "../", t.root, "**/", t.entry, "*/*." + s) : r.resolve(t.dirname, t.root, "*", "*." + s));
        return t.hasOwnProperty("cssEntries") && !t.cssEntries ? e : [...e, ...n];
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
  C as baseConfig,
  h as kebabToCamelCase,
  D as rollUpCopyAssets,
  k as rollupEmptyDirs,
  O as rollupEncapsulateBundles,
  F as viteConfigBase,
  E as viteHandleHotUpdate,
  $ as wpGlobals
};
