import {FullReloadPayload, Plugin} from "vite"

interface ViteHandleHotUpdateOptions extends FullReloadPayload {
    path: string,
}

/**
 * A custom ViteJS plugin that will automatically recompile the assets and refresh
 * your browser when editing PHP files.
 */
export default function (userOptions?: Partial<ViteHandleHotUpdateOptions>): Plugin {
    const options = {
        ...{
            path: "*",
        },
        ...userOptions
    };
    return {
        name: "php",
        handleHotUpdate({file, server}) {
            if (file.endsWith(".php")) {
                server.ws.send({type: 'full-reload', path: options.path});
            }
        }
    }
}