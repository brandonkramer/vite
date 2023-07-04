import { FullReloadPayload, Plugin } from "vite";
interface ViteHandleHotUpdateOptions extends FullReloadPayload {
    path: string;
}
/**
 * A custom ViteJS plugin that will automatically recompile the assets and refresh
 * your browser when editing PHP files.
 */
export default function (userOptions?: Partial<ViteHandleHotUpdateOptions>): Plugin;
export {};
