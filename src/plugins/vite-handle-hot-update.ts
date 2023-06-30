import {FullReloadPayload, Plugin} from "vite";

/**
 * A custom ViteJS plugin that will automatically recompile the assets and refresh
 * your browser when editing PHP files.
 */
interface Config extends FullReloadPayload {}

const DEFAULT_CONFIG: Config = {
    path: "*",
    type: "full-reload"
};

export default function (userConfig?: Partial<Config>): Plugin {
    const config = {
        ...DEFAULT_CONFIG,
        ...userConfig
    };
    return {
        name: "php",
        handleHotUpdate({file, server}) {
            if (file.endsWith(".php")) {
                server.ws.send({type: config.type, path: config.path});
            }
        }
    }
}