import {FullReloadPayload, Plugin} from "vite"

interface ViteHandleHotUpdateOptions extends FullReloadPayload {
    path: string,
}

/**
 * A custom ViteJS plugin that will automatically recompile the assets and refresh
 * your browser when editing PHP files.
 */
export default function (userOptions?: Partial<ViteHandleHotUpdateOptions>): Plugin {

    /**
     * Core plugin options
     */
    const options = {
        ...{
            path: "*",
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
        name: "vite-handle-hot-update",

        /**
         * Handle hot update hook
         *
         * @param file
         * @param server
         */
        handleHotUpdate({file, server}) {
            if (file.endsWith(".php")) {
                server.ws.send({type: 'full-reload', path: options.path});
            }
        }
    }
}