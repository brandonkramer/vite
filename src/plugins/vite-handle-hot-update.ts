import {FullReloadPayload, Plugin} from "vite"

interface ViteHandleHotUpdateConfig extends FullReloadPayload {
    path: string,
}

/**
 * A custom ViteJS plugin that will automatically recompile the assets and refresh
 * your browser when editing PHP files.
 */
export default function (userViteHandleHotUpdateConfig?: Partial<ViteHandleHotUpdateConfig>): Plugin {
    const config = {
        ...{
            path: "*",
        },
        ...userViteHandleHotUpdateConfig
    };
    return {
        name: "php",
        handleHotUpdate({file, server}) {
            if (file.endsWith(".php")) {
                server.ws.send({type: 'full-reload', path: config.path});
            }
        }
    }
}