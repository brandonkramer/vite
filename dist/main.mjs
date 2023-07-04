import { createHash as g } from "crypto";
import l from "path";
import d from "fs";
import u from "fast-glob";
function k(s) {
  const e = {
    banner: "(function(){",
    footer: "})();",
    ...s
  };
  return {
    name: "rollup-encapsulate-bundles",
    generateBundle(o, r) {
      for (const i of Object.values(r))
        i.type === "chunk" && (i.code = e.banner + i.code + e.footer);
    }
  };
}
function D(s) {
  let e;
  const o = {
    hash: !0,
    rules: {
      images: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
      svg: /png|jpe?g|svg|gif|tiff|bmp|ico/i,
      fonts: /ttf|woff|woff2/i
    },
    ...s
  };
  return {
    name: "rollup-copy-asset-files",
    /**
     * Hook in to get the resolved configurations
     * @param resolvedConfig
     */
    configResolved(r) {
      e = r;
    },
    /**
     * Hook in to emit our asset files
     */
    async buildStart() {
      const r = (t) => g("sha256").update(t).digest("hex").slice(0, 8), i = (t = {}) => {
        const a = [
          e.root,
          ...u.sync(l.resolve(e.root, "**/*"), { onlyDirectories: !0 })
        ];
        for (const c of a)
          for (const [n, f] of Object.entries(o.rules))
            n in t || (t[n] = []), t[n] = [...t[n], ...u.sync(l.resolve(c, n, "**/*"))];
        return t;
      };
      for (const [t, a] of Object.entries(i()))
        a.map((c) => {
          const n = c.split("/" + t + "/")[1], f = c.split(e.root + "/")[1], m = n.lastIndexOf("."), p = n.substring(m + 1), y = n.substring(0, m);
          if (p !== "" && o.rules[t].test(p)) {
            const b = {
              type: "asset",
              fileName: o.hash ? t + "/" + y + "." + r(n) + "." + p : t + "/" + y + "." + p,
              source: d.readFileSync(c),
              name: f
            };
            this.emitFile(b);
          }
        });
    }
  };
}
function O(s) {
  const e = {
    dirname: "",
    buildPath: "",
    emptyDirs: ["css", "js", "svg", "images", "fonts"],
    ...s
  };
  return {
    name: "rollup-empty-dirs",
    async buildStart() {
      for (const o of e.emptyDirs)
        await ((r) => {
          d.existsSync(r) && (d.rmSync(r, { recursive: !0 }), console.log("deleted " + r));
        })(l.resolve(e.dirname, e.buildPath, o));
    }
  };
}
function F(s) {
  const e = {
    path: "*",
    ...s
  };
  return {
    name: "vite-handle-hot-update",
    handleHotUpdate({ file: o, server: r }) {
      o.endsWith(".php") && r.ws.send({ type: "full-reload", path: e.path });
    }
  };
}
function C(s) {
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
    ...s
  };
  return {
    name: "vite-config-base",
    config: (o, { command: r, mode: i }) => ({
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
        minify: i === "development" ? !1 : "esbuild",
        sourcemap: i === "development",
        outDir: "../" + e.outDir,
        commonjsOptions: { transformMixedEsModules: !0 },
        /* RollupJS options */
        rollupOptions: {
          input: (() => {
            const t = u.sync(typeof e.entry == "string" ? l.resolve(e.dirname, e.root, "../", e.root, "**/", e.entry, "*/*.js") : l.resolve(e.dirname, e.root, "*", "*.js")), a = u.sync(typeof e.entry == "string" ? l.resolve(e.dirname, e.root, "../", e.root, "**/", e.entry, "*/*." + e.css.extension) : l.resolve(e.dirname, e.root, "*", "*." + e.css.extension));
            return e.css.entries ? [...t, ...a] : t;
          })(),
          output: {
            entryFileNames: (t) => "js/[name].[hash].js",
            assetFileNames: (t) => {
              let a = t.name.split(".")[1];
              return /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(a) ? "images/[name][extname]" : a + "/[name].[hash][extname]";
            }
          }
        }
      }
    })
  };
}
function h(s) {
  return s.replace(/-([a-z])/g, (e, o) => o.toUpperCase());
}
function M() {
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
    ].map((o) => [`@wordpress/${o}`, `wp.${h(o)}`]))
  };
}
export {
  h as kebabToCamelCase,
  D as rollUpCopyAssets,
  O as rollupEmptyDirs,
  k as rollupEncapsulateBundles,
  C as viteConfigBase,
  F as viteHandleHotUpdate,
  M as wpGlobals
};
