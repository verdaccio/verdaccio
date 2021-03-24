import buildDebug from 'debug';
import { getManifestValue, Manifest } from './manifest';

const debug = buildDebug('verdaccio');

export type TemplateUIOptions = {
  title?: string;
  uri?: string;
  darkMode?: boolean;
  protocol?: string;
  host?: string;
  url_prefix?: string;
  base: string;
  primaryColor?: string;
  version?: string;
  logoURI?: string;
  scope?: string;
  language?: string;
};

export type Template = {
  manifest: Manifest;
  options: TemplateUIOptions;
  scriptsBodyAfter?: string[];
  metaScripts?: string[];
  bodyBefore?: string[];
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
        ${template?.metaScripts ? template.metaScripts.map((item) => item) : ''}
      </head>    
      <body class="body">
      ${template?.bodyBefore ? template.bodyBefore.map((item) => item) : ''}
        <div id="root"></div>
        ${getManifestValue(template.manifest.js, manifest, template?.options.base).map((item) => `<script defer="defer" src="${item}"></script>`)}
        ${template?.scriptsBodyAfter ? template.scriptsBodyAfter.map((item) => item) : ''}
      </body>
    </html>
  `;
}
