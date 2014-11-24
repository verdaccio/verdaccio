module.exports = function(hljs) {
  return {
    subLanguage: 'xml', subLanguageMode: 'continuous',
    contains: [
      {
        className: 'comment',
        begin: '<%#', end: '%>',
      },
      {
        begin: '<%[%=-]?', end: '[%-]?%>',
        subLanguage: 'ruby',
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
};