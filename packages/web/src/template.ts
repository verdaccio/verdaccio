import { getManifestValue, Manifest } from './manifest';

export type TemplateUIOptions = {
  title?: string;
  uri?: string;
  darkMode?: boolean;
  protocol?: string;
  host?: string;
  url_prefix?: string;
  base?: string;
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
  bodyBefore?: string;
  bodyAfter?: string;
};

// the outcome of the Webpack Manifest Plugin
export interface WebpackManifest {
  [key: string]: string;
}

export default (template: Template, manifest: WebpackManifest) => `
    <!DOCTYPE html>
      <html lang="en-us"> 
      <head>
        <meta charset="utf-8">
        <title>${template?.options?.title ?? ''}</title>        
        <link rel="icon" type="image/png" href="${template.manifest.ico}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${getManifestValue(template.manifest.css, manifest).map(
          (item) => ` <link href="${item}" rel="stylesheet">`
        )}        
        <script>
            window.__VERDACCIO_BASENAME_UI_OPTIONS=${JSON.stringify(template.options)}
        </script>
        ${template.metaScripts ? template.metaScripts.map((item) => item) : ''}
      </head>    
      <body class="body">
        ${template.bodyBefore ? template.bodyBefore : ''}
        <div id="root"></div>
        ${getManifestValue(template.manifest.js, manifest).map(
          (item) => `<script defer="defer" src="${item}"></script>`
        )}
        ${template.scriptsBodyAfter ? template.scriptsBodyAfter.map((item) => item) : ''}
      </body>
    </html>
`;
