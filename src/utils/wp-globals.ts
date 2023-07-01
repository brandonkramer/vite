import kebabToCamelCase from './kebab-to-camelcase';

type WPGlobals = {
    [ key: string ]: string | string[];
};

export default function wpGlobals(): WPGlobals {
    const wpModules = [
        'a11y',
        'annotations',
        'api-fetch',
        'autop',
        'blob',
        'block-directory',
        'block-editor',
        'block-library',
        'block-serialization-default-parser',
        'blocks',
        'components',
        'compose',
        'core-data',
        'data',
        'data-controls',
        'date',
        'deprecated',
        'dom',
        'dom-ready',
        'edit-post',
        'editor',
        'element',
        'escape-html',
        'format-library',
        'hooks',
        'html-entities',
        'i18n',
        'is-shallow-equal',
        'keyboard-shortcuts',
        'keycodes',
        'list-reusable-blocks',
        'media-utils',
        'notices',
        'nux',
        'plugins',
        'primitives',
        'priority-queue',
        'redux-routine',
        'reusable-blocks',
        'rich-text',
        'server-side-render',
        'shortcode',
        'token-list',
        'url',
        'viewport',
        'warning',
        'wordcount',
    ];

    const otherModules = {
        'jquery': 'jQuery',
        'tinymce': 'tinymce',
        'moment': 'moment',
        'react': 'React',
        'react-dom': 'ReactDOM',
        'backbone': 'Backbone',
        'lodash': 'lodash',
    };

    return {
        ...otherModules,
        ...Object.fromEntries(
            wpModules.map( handle => [ `@wordpress/${ handle }`, `wp.${ kebabToCamelCase( handle ) }` ] ),
        ),
    };
}