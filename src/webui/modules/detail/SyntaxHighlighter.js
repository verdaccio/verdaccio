import Prism from 'prismjs/components/prism-core';

import 'prismjs/themes/prism.css';

// NOTE: import order is important
import 'prismjs/components/prism-clike';

import 'prismjs/components/prism-css';
import 'prismjs/components/prism-css-extras';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';

import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-flow';

import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';

import 'prismjs/components/prism-markdown';

import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-graphql';

module.exports = {
  highlightAll: function() {
    Prism.highlightAll();
  }
};
