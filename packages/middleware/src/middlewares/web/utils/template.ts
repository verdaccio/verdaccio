import buildDebug from 'debug';

import { TemplateUIOptions } from '@verdaccio/types';

import { Manifest, getManifestValue } from './manifest';

const debug = buildDebug('verdaccio:web:render:template');

export type Template = {
  manifest: Manifest;
  options: TemplateUIOptions;
  metaScripts?: string[];
  scriptsBodyAfter?: string[];
  scriptsbodyBefore?: string[];
};

// the outcome of the Webpack Manifest Plugin
export interface WebpackManifest {
  [key: string]: string;
}

export default function renderTemplate(template: Template, manifest: WebpackManifest) {
  debug('template %o', template);
  debug('manifest %o', manifest);

  return `
    <!DOCTYPE html>
      <html lang="en-us"> 
      <head>
        <meta charset="utf-8">
        <base href="${template?.options.base}">
        <title>${template?.options?.title ?? ''}</title>        
        <link rel="icon" href="${template?.options.base}-/static/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" /> 
        <script>
            window.__VERDACCIO_BASENAME_UI_OPTIONS=${JSON.stringify(template.options)}
        </script>
        ${template?.metaScripts ? template.metaScripts.join('') : ''}
      </head>    
      <body class="body">
      ${template?.scriptsbodyBefore ? template.scriptsbodyBefore.join('') : ''}
        <div id="root"></div>
        ${getManifestValue(template.manifest.js, manifest, template?.options.base)
          .map((item) => `<script defer="defer" src="${item}"></script>`)
          .join('')}
        ${template?.scriptsBodyAfter ? template.scriptsBodyAfter.join('') : ''}
      </body>
    </html>
  `;
}
