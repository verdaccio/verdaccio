'use strict';var _vm = require('vm');var _vm2 = _interopRequireDefault(_vm);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2.default)('dynamic-import-chunkname') },

    schema: [{
      type: 'object',
      properties: {
        importFunctions: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string' } },


        webpackChunknameFormat: {
          type: 'string' } } }] },





  create: function (context) {
    const config = context.options[0];var _ref =
    config || {},_ref$importFunctions = _ref.importFunctions;const importFunctions = _ref$importFunctions === undefined ? [] : _ref$importFunctions;var _ref2 =
    config || {},_ref2$webpackChunknam = _ref2.webpackChunknameFormat;const webpackChunknameFormat = _ref2$webpackChunknam === undefined ? '[0-9a-zA-Z-_/.]+' : _ref2$webpackChunknam;

    const paddedCommentRegex = /^ (\S[\s\S]+\S) $/;
    const commentStyleRegex = /^( \w+: ("[^"]*"|\d+|false|true),?)+ $/;
    const chunkSubstrFormat = ` webpackChunkName: "${webpackChunknameFormat}",? `;
    const chunkSubstrRegex = new RegExp(chunkSubstrFormat);

    function run(node, arg) {
      const sourceCode = context.getSourceCode();
      const leadingComments = sourceCode.getCommentsBefore ?
      sourceCode.getCommentsBefore(arg) // This method is available in ESLint >= 4.
      : sourceCode.getComments(arg).leading; // This method is deprecated in ESLint 7.

      if (!leadingComments || leadingComments.length === 0) {
        context.report({
          node,
          message: 'dynamic imports require a leading comment with the webpack chunkname' });

        return;
      }

      let isChunknamePresent = false;

      for (const comment of leadingComments) {
        if (comment.type !== 'Block') {
          context.report({
            node,
            message: 'dynamic imports require a /* foo */ style comment, not a // foo comment' });

          return;
        }

        if (!paddedCommentRegex.test(comment.value)) {
          context.report({
            node,
            message: `dynamic imports require a block comment padded with spaces - /* foo */` });

          return;
        }

        try {
          // just like webpack itself does
          _vm2.default.runInNewContext(`(function(){return {${comment.value}}})()`);
        }
        catch (error) {
          context.report({
            node,
            message: `dynamic imports require a "webpack" comment with valid syntax` });

          return;
        }

        if (!commentStyleRegex.test(comment.value)) {
          context.report({
            node,
            message:
            `dynamic imports require a leading comment in the form /*${chunkSubstrFormat}*/` });

          return;
        }

        if (chunkSubstrRegex.test(comment.value)) {
          isChunknamePresent = true;
        }
      }

      if (!isChunknamePresent) {
        context.report({
          node,
          message:
          `dynamic imports require a leading comment in the form /*${chunkSubstrFormat}*/` });

      }
    }

    return {
      ImportExpression(node) {
        run(node, node.source);
      },

      CallExpression(node) {
        if (node.callee.type !== 'Import' && importFunctions.indexOf(node.callee.name) < 0) {
          return;
        }

        run(node, node.arguments[0]);
      } };

  } };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9keW5hbWljLWltcG9ydC1jaHVua25hbWUuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJpbXBvcnRGdW5jdGlvbnMiLCJ1bmlxdWVJdGVtcyIsIml0ZW1zIiwid2VicGFja0NodW5rbmFtZUZvcm1hdCIsImNyZWF0ZSIsImNvbnRleHQiLCJjb25maWciLCJvcHRpb25zIiwicGFkZGVkQ29tbWVudFJlZ2V4IiwiY29tbWVudFN0eWxlUmVnZXgiLCJjaHVua1N1YnN0ckZvcm1hdCIsImNodW5rU3Vic3RyUmVnZXgiLCJSZWdFeHAiLCJydW4iLCJub2RlIiwiYXJnIiwic291cmNlQ29kZSIsImdldFNvdXJjZUNvZGUiLCJsZWFkaW5nQ29tbWVudHMiLCJnZXRDb21tZW50c0JlZm9yZSIsImdldENvbW1lbnRzIiwibGVhZGluZyIsImxlbmd0aCIsInJlcG9ydCIsIm1lc3NhZ2UiLCJpc0NodW5rbmFtZVByZXNlbnQiLCJjb21tZW50IiwidGVzdCIsInZhbHVlIiwidm0iLCJydW5Jbk5ld0NvbnRleHQiLCJlcnJvciIsIkltcG9ydEV4cHJlc3Npb24iLCJzb3VyY2UiLCJDYWxsRXhwcmVzc2lvbiIsImNhbGxlZSIsImluZGV4T2YiLCJuYW1lIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiYUFBQSx3QjtBQUNBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsV0FBSyx1QkFBUSwwQkFBUixDQURELEVBRkY7O0FBS0pDLFlBQVEsQ0FBQztBQUNQSCxZQUFNLFFBREM7QUFFUEksa0JBQVk7QUFDVkMseUJBQWlCO0FBQ2ZMLGdCQUFNLE9BRFM7QUFFZk0sdUJBQWEsSUFGRTtBQUdmQyxpQkFBTztBQUNMUCxrQkFBTSxRQURELEVBSFEsRUFEUDs7O0FBUVZR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bEY7QUFDRDs7QUFFRHhCLFlBQUlDLElBQUosRUFBVUEsS0FBS3dCLFNBQUwsQ0FBZSxDQUFmLENBQVY7QUFDRCxPQVhJLEVBQVA7O0FBYUQsR0FsSGMsRUFBakIiLCJmaWxlIjoiZHluYW1pYy1pbXBvcnQtY2h1bmtuYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHZtIGZyb20gJ3ZtJ1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCdkeW5hbWljLWltcG9ydC1jaHVua25hbWUnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW3tcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBpbXBvcnRGdW5jdGlvbnM6IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB3ZWJwYWNrQ2h1bmtuYW1lRm9ybWF0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1dLFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICBjb25zdCBjb25maWcgPSBjb250ZXh0Lm9wdGlvbnNbMF1cbiAgICBjb25zdCB7IGltcG9ydEZ1bmN0aW9ucyA9IFtdIH0gPSBjb25maWcgfHwge31cbiAgICBjb25zdCB7IHdlYnBhY2tDaHVua25hbWVGb3JtYXQgPSAnWzAtOWEtekEtWi1fLy5dKycgfSA9IGNvbmZpZyB8fCB7fVxuXG4gICAgY29uc3QgcGFkZGVkQ29tbWVudFJlZ2V4ID0gL14gKFxcU1tcXHNcXFNdK1xcUykgJC9cbiAgICBjb25zdCBjb21tZW50U3R5bGVSZWdleCA9IC9eKCBcXHcrOiAoXCJbXlwiXSpcInxcXGQrfGZhbHNlfHRydWUpLD8pKyAkL1xuICAgIGNvbnN0IGNodW5rU3Vic3RyRm9ybWF0ID0gYCB3ZWJwYWNrQ2h1bmtOYW1lOiBcIiR7d2VicGFja0NodW5rbmFtZUZvcm1hdH1cIiw/IGBcbiAgICBjb25zdCBjaHVua1N1YnN0clJlZ2V4ID0gbmV3IFJlZ0V4cChjaHVua1N1YnN0ckZvcm1hdClcblxuICAgIGZ1bmN0aW9uIHJ1bihub2RlLCBhcmcpIHtcbiAgICAgIGNvbnN0IHNvdXJjZUNvZGUgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKVxuICAgICAgY29uc3QgbGVhZGluZ0NvbW1lbnRzID0gc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZVxuICAgICAgICA/IHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNCZWZvcmUoYXJnKSAvLyBUaGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgaW4gRVNMaW50ID49IDQuXG4gICAgICAgIDogc291cmNlQ29kZS5nZXRDb21tZW50cyhhcmcpLmxlYWRpbmcgLy8gVGhpcyBtZXRob2QgaXMgZGVwcmVjYXRlZCBpbiBFU0xpbnQgNy5cblxuICAgICAgaWYgKCFsZWFkaW5nQ29tbWVudHMgfHwgbGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSBsZWFkaW5nIGNvbW1lbnQgd2l0aCB0aGUgd2VicGFjayBjaHVua25hbWUnLFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IGlzQ2h1bmtuYW1lUHJlc2VudCA9IGZhbHNlXG5cbiAgICAgIGZvciAoY29uc3QgY29tbWVudCBvZiBsZWFkaW5nQ29tbWVudHMpIHtcbiAgICAgICAgaWYgKGNvbW1lbnQudHlwZSAhPT0gJ0Jsb2NrJykge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSAvKiBmb28gKi8gc3R5bGUgY29tbWVudCwgbm90IGEgLy8gZm9vIGNvbW1lbnQnLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBhZGRlZENvbW1lbnRSZWdleC50ZXN0KGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBkeW5hbWljIGltcG9ydHMgcmVxdWlyZSBhIGJsb2NrIGNvbW1lbnQgcGFkZGVkIHdpdGggc3BhY2VzIC0gLyogZm9vICovYCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBqdXN0IGxpa2Ugd2VicGFjayBpdHNlbGYgZG9lc1xuICAgICAgICAgIHZtLnJ1bkluTmV3Q29udGV4dChgKGZ1bmN0aW9uKCl7cmV0dXJuIHske2NvbW1lbnQudmFsdWV9fX0pKClgKVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBgZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSBcIndlYnBhY2tcIiBjb21tZW50IHdpdGggdmFsaWQgc3ludGF4YCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb21tZW50U3R5bGVSZWdleC50ZXN0KGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAgIGBkeW5hbWljIGltcG9ydHMgcmVxdWlyZSBhIGxlYWRpbmcgY29tbWVudCBpbiB0aGUgZm9ybSAvKiR7Y2h1bmtTdWJzdHJGb3JtYXR9Ki9gLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2h1bmtTdWJzdHJSZWdleC50ZXN0KGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgICAgaXNDaHVua25hbWVQcmVzZW50ID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDaHVua25hbWVQcmVzZW50KSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICBgZHluYW1pYyBpbXBvcnRzIHJlcXVpcmUgYSBsZWFkaW5nIGNvbW1lbnQgaW4gdGhlIGZvcm0gLyoke2NodW5rU3Vic3RyRm9ybWF0fSovYCxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RXhwcmVzc2lvbihub2RlKSB7XG4gICAgICAgIHJ1bihub2RlLCBub2RlLnNvdXJjZSlcbiAgICAgIH0sXG5cbiAgICAgIENhbGxFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuY2FsbGVlLnR5cGUgIT09ICdJbXBvcnQnICYmIGltcG9ydEZ1bmN0aW9ucy5pbmRleE9mKG5vZGUuY2FsbGVlLm5hbWUpIDwgMCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgcnVuKG5vZGUsIG5vZGUuYXJndW1lbnRzWzBdKVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG4iXX0=