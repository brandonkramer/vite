import type { Plugin } from 'vite';
export interface RollupEncapsulateBundlesOptions {
    banner: string;
    footer: string;
}
/**
 * A custom RollUpJS plugin that encapsulate bundles
 *
 * @param userOptions
 */
export default function (userOptions?: Partial<RollupEncapsulateBundlesOptions>): Plugin;
