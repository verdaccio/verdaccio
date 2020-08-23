define(['exports', '../exception', '../utils', './ast'], function (exports, _exception, _utils, _ast) {
  /* eslint-disable new-cap */

  'use strict';

  exports.__esModule = true;
  exports.Compiler = Compiler;
  exports.precompile = precompile;
  exports.compile = compile;
  // istanbul ignore next

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Exception = _interopRequireDefault(_exception);

  var _AST = _interopRequireDefault(_ast);

  var slice = [].slice;

  function Compiler() {}

  // the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    equals: function equals(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
          return false;
        }
      }

      // We know that length is the same between the two arrays because they are directly tied
      // to the opcode behavior above.
      len = this.children.length;
      for (var i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function compile(program, options) {
      this.sourceNode = [];
      this.opcodes = [];
      this.children = [];
      this.options = options;
      this.stringParams = options.stringParams;
      this.trackIds = options.trackIds;

      options.blockParams = options.blockParams || [];

      options.knownHelpers = _utils.extend(Object.create(null), {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true,
        'lookup': true
      }, options.knownHelpers);

      return this.accept(program);
    },

    compileProgram: function compileProgram(program) {
      var childCompiler = new this.compiler(),
          // eslint-disable-line new-cap
      result = childCompiler.compile(program, this.options),
          guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;
      this.useDepths = this.useDepths || result.useDepths;

      return guid;
    },

    accept: function accept(node) {
      /* istanbul ignore next: Sanity code */
      if (!this[node.type]) {
        throw new _Exception['default']('Unknown type: ' + node.type, node);
      }

      this.sourceNode.unshift(node);
      var ret = this[node.type](node);
      this.sourceNode.shift();
      return ret;
    },

    Program: function Program(program) {
      this.options.blockParams.unshift(program.blockParams);

      var body = program.body,
          bodyLength = body.length;
      for (var i = 0; i < bodyLength; i++) {
        this.accept(body[i]);
      }

      this.options.blockParams.shift();

      this.isSimple = bodyLength === 1;
      this.blockParams = program.blockParams ? program.blockParams.length : 0;

      return this;
    },

    BlockStatement: function BlockStatement(block) {
      transformLiteralToPath(block);

      var program = block.program,
          inverse = block.inverse;

      program = program && this.compileProgram(program);
      inverse = inverse && this.compileProgram(inverse);

      var type = this.classifySexpr(block);

      if (type === 'helper') {
        this.helperSexpr(block, program, inverse);
      } else if (type === 'simple') {
        this.simpleSexpr(block);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue', block.path.original);
      } else {
        this.ambiguousSexpr(block, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    DecoratorBlock: function DecoratorBlock(decorator) {
      var program = decorator.program && this.compileProgram(decorator.program);
      var params = this.setupFullMustacheParams(decorator, program, undefined),
          path = decorator.path;

      this.useDecorators = true;
      this.opcode('registerDecorator', params.length, path.original);
    },

    PartialStatement: function PartialStatement(partial) {
      this.usePartial = true;

      var program = partial.program;
      if (program) {
        program = this.compileProgram(partial.program);
      }

      var params = partial.params;
      if (params.length > 1) {
        throw new _Exception['default']('Unsupported number of partial arguments: ' + params.length, partial);
      } else if (!params.length) {
        if (this.options.explicitPartialContext) {
          this.opcode('pushLiteral', 'undefined');
        } else {
          params.push({ type: 'PathExpression', parts: [], depth: 0 });
        }
      }

      var partialName = partial.name.original,
          isDynamic = partial.name.type === 'SubExpression';
      if (isDynamic) {
        this.accept(partial.name);
      }

      this.setupFullMustacheParams(partial, program, undefined, true);

      var indent = partial.indent || '';
      if (this.options.preventIndent && indent) {
        this.opcode('appendContent', indent);
        indent = '';
      }

      this.opcode('invokePartial', isDynamic, partialName, indent);
      this.opcode('append');
    },
    PartialBlockStatement: function PartialBlockStatement(partialBlock) {
      this.PartialStatement(partialBlock);
    },

    MustacheStatement: function MustacheStatement(mustache) {
      this.SubExpression(mustache);

      if (mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },
    Decorator: function Decorator(decorator) {
      this.DecoratorBlock(decorator);
    },

    ContentStatement: function ContentStatement(content) {
      if (content.value) {
        this.opcode('appendContent', content.value);
      }
    },

    CommentStatement: function CommentStatement() {},

    SubExpression: function SubExpression(sexpr) {
      transformLiteralToPath(sexpr);
      var type = this.classifySexpr(sexpr);

      if (type === 'simple') {
        this.simpleSexpr(sexpr);
      } else if (type === 'helper') {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },
    ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
      var path = sexpr.path,
          name = path.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', path.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      path.strict = true;
      this.accept(path);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function simpleSexpr(sexpr) {
      var path = sexpr.path;
      path.strict = true;
      this.accept(path);
      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function helperSexpr(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          path = sexpr.path,
          name = path.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new _Exception['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
      } else {
        path.strict = true;
        path.falsy = true;

        this.accept(path);
        this.opcode('invokeHelper', params.length, path.original, _AST['default'].helpers.simpleId(path));
      }
    },

    PathExpression: function PathExpression(path) {
      this.addDepth(path.depth);
      this.opcode('getContext', path.depth);

      var name = path.parts[0],
          scoped = _AST['default'].helpers.scopedId(path),
          blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

      if (blockParamId) {
        this.opcode('lookupBlockParam', blockParamId, path.parts);
      } else if (!name) {
        // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
        this.opcode('pushContext');
      } else if (path.data) {
        this.options.data = true;
        this.opcode('lookupData', path.depth, path.parts, path.strict);
      } else {
        this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
      }
    },

    StringLiteral: function StringLiteral(string) {
      this.opcode('pushString', string.value);
    },

    NumberLiteral: function NumberLiteral(number) {
      this.opcode('pushLiteral', number.value);
    },

    BooleanLiteral: function BooleanLiteral(bool) {
      this.opcode('pushLiteral', bool.value);
    },

    UndefinedLiteral: function UndefinedLiteral() {
      this.opcode('pushLiteral', 'undefined');
    },

    NullLiteral: function NullLiteral() {
      this.opcode('pushLiteral', 'null');
    },

    Hash: function Hash(hash) {
      var pairs = hash.pairs,
          i = 0,
          l = pairs.length;

      this.opcode('pushHash');

      for (; i < l; i++) {
        this.pushParam(pairs[i].value);
      }
      while (i--) {
        this.opcode('assignToHash', pairs[i].key);
      }
      this.opcode('popHash');
    },

    // HELPERS
    opcode: function opcode(name) {
      this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
    },

    addDepth: function addDepth(depth) {
      if (!depth) {
        return;
      }

      this.useDepths = true;
    },

    classifySexpr: function classifySexpr(sexpr) {
      var isSimple = _AST['default'].helpers.simpleId(sexpr.path);

      var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      var isHelper = !isBlockParam && _AST['default'].helpers.helperExpression(sexpr);

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
      var isEligible = !isBlockParam && (isHelper || isSimple);

      // if ambiguous, we can possibly resolve the ambiguity now
      // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
      if (isEligible && !isHelper) {
        var _name = sexpr.path.parts[0],
            options = this.options;
        if (options.knownHelpers[_name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) {
        return 'helper';
      } else if (isEligible) {
        return 'ambiguous';
      } else {
        return 'simple';
      }
    },

    pushParams: function pushParams(params) {
      for (var i = 0, l = params.length; i < l; i++) {
        this.pushParam(params[i]);
      }
    },

    pushParam: function pushParam(val) {
      var value = val.value != null ? val.value : val.original || '';

      if (this.stringParams) {
        if (value.replace) {
          value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
        }

        if (val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode('getContext', val.depth || 0);
        this.opcode('pushStringParam', value, val.type);

        if (val.type === 'SubExpression') {
          // SubExpressions get evaluated and passed in
          // in string params mode.
          this.accept(val);
        }
      } else {
        if (this.trackIds) {
          var blockParamIndex = undefined;
          if (val.parts && !_AST['default'].helpers.scopedId(val) && !val.depth) {
            blockParamIndex = this.blockParamIndex(val.parts[0]);
          }
          if (blockParamIndex) {
            var blockParamChild = val.parts.slice(1).join('.');
            this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
          } else {
            value = val.original || value;
            if (value.replace) {
              value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
            }

            this.opcode('pushId', val.type, value);
          }
        }
        this.accept(val);
      }
    },

    setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.accept(sexpr.hash);
      } else {
        this.opcode('emptyHash', omitEmpty);
      }

      return params;
    },

    blockParamIndex: function blockParamIndex(name) {
      for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
        var blockParams = this.options.blockParams[depth],
            param = blockParams && _utils.indexOf(blockParams, name);
        if (blockParams && param >= 0) {
          return [depth, param];
        }
      }
    }
  };

  function precompile(input, options, env) {
    if (input == null || typeof input !== 'string' && input.type !== 'Program') {
      throw new _Exception['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var ast = env.parse(input, options),
        environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  function compile(input, options, env) {
    if (options === undefined) options = {};

    if (input == null || typeof input !== 'string' && input.type !== 'Program') {
      throw new _Exception['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
    }

    options = _utils.extend({}, options);
    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var compiled = undefined;

    function compileInput() {
      var ast = env.parse(input, options),
          environment = new env.Compiler().compile(ast, options),
          templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    // Template is only compiled on first use and cached after that point.
    function ret(context, execOptions) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, execOptions);
    }
    ret._setup = function (setupOptions) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._setup(setupOptions);
    };
    ret._child = function (i, data, blockParams, depths) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._child(i, data, blockParams, depths);
    };
    return ret;
  }

  function argEquals(a, b) {
    if (a === b) {
      return true;
    }

    if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
      for (var i = 0; i < a.length; i++) {
        if (!argEquals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }

  function transformLiteralToPath(sexpr) {
    if (!sexpr.path.parts) {
      var literal = sexpr.path;
      // Casting to string here to make false and 0 literal values play nicely with the rest
      // of the system.
      sexpr.path = {
        type: 'PathExpression',
        data: false,
        depth: 0,
        parts: [literal.original + ''],
        original: literal.original + '',
        loc: literal.loc
      };
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2NvbXBpbGVyL2NvbXBpbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQzs7QUFFaEIsV0FBUyxRQUFRLEdBQUcsRUFBRTs7Ozs7OztBQU83QixVQUFRLENBQUMsU0FBUyxHQUFHO0FBQ25CLFlBQVEsRUFBRSxRQUFROztBQUVsQixVQUFNLEVBQUUsZ0JBQVMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzlCLFVBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO0FBQ2hDLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QixZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4QixXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxZQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNyRixpQkFBTyxLQUFLLENBQUM7U0FDZDtPQUNGOzs7O0FBSUQsU0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzNCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUIsWUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMvQyxpQkFBTyxLQUFLLENBQUM7U0FDZDtPQUNGOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7O0FBRUQsUUFBSSxFQUFFLENBQUM7O0FBRVAsV0FBTyxFQUFFLGlCQUFTLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDbEMsVUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsVUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7QUFFakMsYUFBTyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQzs7QUFFaEQsYUFBTyxDQUFDLFlBQVksR0FBRyxPQXJERCxNQUFNLENBcURFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDakQsdUJBQWUsRUFBRSxJQUFJO0FBQ3JCLDRCQUFvQixFQUFFLElBQUk7QUFDMUIsY0FBTSxFQUFFLElBQUk7QUFDWixZQUFJLEVBQUUsSUFBSTtBQUNWLGdCQUFRLEVBQUUsSUFBSTtBQUNkLGNBQU0sRUFBRSxJQUFJO0FBQ1osYUFBSyxFQUFFLElBQUk7QUFDWCxnQkFBUSxFQUFFLElBQUk7T0FDZixFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFekIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzdCOztBQUVELGtCQUFjLEVBQUUsd0JBQVMsT0FBTyxFQUFFO0FBQ2hDLFVBQUksYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTs7QUFDbkMsWUFBTSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7VUFDckQsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFdkIsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUM7O0FBRXZELFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDOztBQUVwRCxhQUFPLElBQUksQ0FBQztLQUNiOztBQUVELFVBQU0sRUFBRSxnQkFBUyxJQUFJLEVBQUU7O0FBRXJCLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3BCLGNBQU0sMEJBQWMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztPQUN6RDs7QUFFRCxVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEIsYUFBTyxHQUFHLENBQUM7S0FDWjs7QUFFRCxXQUFPLEVBQUUsaUJBQVMsT0FBTyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXRELFVBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJO1VBQ25CLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzdCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN0Qjs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRXhFLGFBQU8sSUFBSSxDQUFDO0tBQ2I7O0FBRUQsa0JBQWMsRUFBRSx3QkFBUyxLQUFLLEVBQUU7QUFDOUIsNEJBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTlCLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPO1VBQ3ZCLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDOztBQUU1QixhQUFPLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEQsYUFBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVsRCxVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVyQyxVQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDckIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzNDLE1BQU0sSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzVCLFlBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7QUFJeEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ2hELE1BQU07QUFDTCxZQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7QUFJN0MsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7T0FDcEM7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN2Qjs7QUFFRCxrQkFBYyxFQUFBLHdCQUFDLFNBQVMsRUFBRTtBQUN4QixVQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFFLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQztVQUNwRSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNoRTs7QUFFRCxvQkFBZ0IsRUFBRSwwQkFBUyxPQUFPLEVBQUU7QUFDbEMsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXZCLFVBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDOUIsVUFBSSxPQUFPLEVBQUU7QUFDWCxlQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDaEQ7O0FBRUQsVUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUM1QixVQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JCLGNBQU0sMEJBQWMsMkNBQTJDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUMzRixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFlBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRTtBQUN2QyxjQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUN6QyxNQUFNO0FBQ0wsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUM1RDtPQUNGOztBQUVELFVBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUTtVQUNuQyxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDO0FBQ3RELFVBQUksU0FBUyxFQUFFO0FBQ2IsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDM0I7O0FBRUQsVUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVoRSxVQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNsQyxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLE1BQU0sRUFBRTtBQUN4QyxZQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyQyxjQUFNLEdBQUcsRUFBRSxDQUFDO09BQ2I7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZCO0FBQ0QseUJBQXFCLEVBQUUsK0JBQVMsWUFBWSxFQUFFO0FBQzVDLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNyQzs7QUFFRCxxQkFBaUIsRUFBRSwyQkFBUyxRQUFRLEVBQUU7QUFDcEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFN0IsVUFBSSxRQUFRLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDOUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztPQUM5QixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUN2QjtLQUNGO0FBQ0QsYUFBUyxFQUFBLG1CQUFDLFNBQVMsRUFBRTtBQUNuQixVQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2hDOztBQUdELG9CQUFnQixFQUFFLDBCQUFTLE9BQU8sRUFBRTtBQUNsQyxVQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDakIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzdDO0tBQ0Y7O0FBRUQsb0JBQWdCLEVBQUUsNEJBQVcsRUFBRTs7QUFFL0IsaUJBQWEsRUFBRSx1QkFBUyxLQUFLLEVBQUU7QUFDN0IsNEJBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckMsVUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDekIsTUFBTSxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDNUIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN6QixNQUFNO0FBQ0wsWUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUM1QjtLQUNGO0FBQ0Qsa0JBQWMsRUFBRSx3QkFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUNoRCxVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSTtVQUNqQixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7VUFDcEIsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQzs7QUFFakQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV0QyxVQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNwQyxVQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDL0M7O0FBRUQsZUFBVyxFQUFFLHFCQUFTLEtBQUssRUFBRTtBQUMzQixVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQ3RDOztBQUVELGVBQVcsRUFBRSxxQkFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUM3QyxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7VUFDOUQsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJO1VBQ2pCLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV6QixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ25DLFlBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztPQUN2RCxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtBQUN4QyxjQUFNLDBCQUFjLDhEQUE4RCxHQUFHLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNuRyxNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLGdCQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztPQUN2RjtLQUNGOztBQUVELGtCQUFjLEVBQUUsd0JBQVMsSUFBSSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLFVBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdEMsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7VUFDcEIsTUFBTSxHQUFHLGdCQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1VBQ25DLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFeEUsVUFBSSxZQUFZLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzNELE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRTs7QUFFaEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztPQUM1QixNQUFNLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNwQixZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDekIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNoRSxNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztPQUM3RTtLQUNGOztBQUVELGlCQUFhLEVBQUUsdUJBQVMsTUFBTSxFQUFFO0FBQzlCLFVBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6Qzs7QUFFRCxpQkFBYSxFQUFFLHVCQUFTLE1BQU0sRUFBRTtBQUM5QixVQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUM7O0FBRUQsa0JBQWMsRUFBRSx3QkFBUyxJQUFJLEVBQUU7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hDOztBQUVELG9CQUFnQixFQUFFLDRCQUFXO0FBQzNCLFVBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQ3pDOztBQUVELGVBQVcsRUFBRSx1QkFBVztBQUN0QixVQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNwQzs7QUFFRCxRQUFJLEVBQUUsY0FBUyxJQUFJLEVBQUU7QUFDbkIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7VUFDbEIsQ0FBQyxHQUFHLENBQUM7VUFDTCxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7QUFFckIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFeEIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2hDO0FBQ0QsYUFBTyxDQUFDLEVBQUUsRUFBRTtBQUNWLFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUMzQztBQUNELFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDeEI7OztBQUdELFVBQU0sRUFBRSxnQkFBUyxJQUFJLEVBQUU7QUFDckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ2xHOztBQUVELFlBQVEsRUFBRSxrQkFBUyxLQUFLLEVBQUU7QUFDeEIsVUFBSSxDQUFDLEtBQUssRUFBRTtBQUNWLGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztLQUN2Qjs7QUFFRCxpQkFBYSxFQUFFLHVCQUFTLEtBQUssRUFBRTtBQUM3QixVQUFJLFFBQVEsR0FBRyxnQkFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEQsVUFBSSxZQUFZLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7QUFJM0UsVUFBSSxRQUFRLEdBQUcsQ0FBQyxZQUFZLElBQUksZ0JBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDOzs7OztBQUtwRSxVQUFJLFVBQVUsR0FBRyxDQUFDLFlBQVksS0FBSyxRQUFRLElBQUksUUFBUSxDQUFBLEFBQUMsQ0FBQzs7OztBQUl6RCxVQUFJLFVBQVUsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUMzQixZQUFJLEtBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDMUIsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDM0IsWUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxFQUFFO0FBQzlCLGtCQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCLE1BQU0sSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7QUFDbkMsb0JBQVUsR0FBRyxLQUFLLENBQUM7U0FDcEI7T0FDRjs7QUFFRCxVQUFJLFFBQVEsRUFBRTtBQUNaLGVBQU8sUUFBUSxDQUFDO09BQ2pCLE1BQU0sSUFBSSxVQUFVLEVBQUU7QUFDckIsZUFBTyxXQUFXLENBQUM7T0FDcEIsTUFBTTtBQUNMLGVBQU8sUUFBUSxDQUFDO09BQ2pCO0tBQ0Y7O0FBRUQsY0FBVSxFQUFFLG9CQUFTLE1BQU0sRUFBRTtBQUMzQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdDLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDM0I7S0FDRjs7QUFFRCxhQUFTLEVBQUUsbUJBQVMsR0FBRyxFQUFFO0FBQ3ZCLFVBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7O0FBRS9ELFVBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyQixZQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDakIsZUFBSyxHQUFHLEtBQUssQ0FDUixPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUMzQixPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzFCOztBQUVELFlBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtBQUNiLGNBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO0FBQ0QsWUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhELFlBQUksR0FBRyxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7OztBQUdoQyxjQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO09BQ0YsTUFBTTtBQUNMLFlBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixjQUFJLGVBQWUsWUFBQSxDQUFDO0FBQ3BCLGNBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLGdCQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO0FBQ3hELDJCQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDdkQ7QUFDRCxjQUFJLGVBQWUsRUFBRTtBQUNuQixnQkFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELGdCQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1dBQ3ZFLE1BQU07QUFDTCxpQkFBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDO0FBQzlCLGdCQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDakIsbUJBQUssR0FBRyxLQUFLLENBQ1IsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FDNUIsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FDcEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQzthQUMxQjs7QUFFRCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztXQUN4QztTQUNGO0FBQ0QsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNsQjtLQUNGOztBQUVELDJCQUF1QixFQUFFLGlDQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUNwRSxVQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLFVBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVwQyxVQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDZCxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN6QixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7T0FDckM7O0FBRUQsYUFBTyxNQUFNLENBQUM7S0FDZjs7QUFFRCxtQkFBZSxFQUFFLHlCQUFTLElBQUksRUFBRTtBQUM5QixXQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDL0UsWUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQzdDLEtBQUssR0FBRyxXQUFXLElBQUksT0E3YmhCLE9BQU8sQ0E2YmlCLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxZQUFJLFdBQVcsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQzdCLGlCQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3ZCO09BQ0Y7S0FDRjtHQUNGLENBQUM7O0FBRUssV0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUU7QUFDOUMsUUFBSSxLQUFLLElBQUksSUFBSSxJQUFLLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsQUFBQyxFQUFFO0FBQzVFLFlBQU0sMEJBQWMsZ0ZBQWdGLEdBQUcsS0FBSyxDQUFDLENBQUM7S0FDL0c7O0FBRUQsV0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDeEIsUUFBSSxFQUFFLE1BQU0sSUFBSSxPQUFPLENBQUEsQUFBQyxFQUFFO0FBQ3hCLGFBQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ3JCO0FBQ0QsUUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ2xCLGFBQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0tBQzFCOztBQUVELFFBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztRQUMvQixXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzRCxXQUFPLElBQUksR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNuRTs7QUFFTSxXQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFPLEdBQUcsRUFBRTtRQUFuQixPQUFPLGdCQUFQLE9BQU8sR0FBRyxFQUFFOztBQUN6QyxRQUFJLEtBQUssSUFBSSxJQUFJLElBQUssT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxBQUFDLEVBQUU7QUFDNUUsWUFBTSwwQkFBYyw2RUFBNkUsR0FBRyxLQUFLLENBQUMsQ0FBQztLQUM1Rzs7QUFFRCxXQUFPLEdBQUcsT0E1ZGMsTUFBTSxDQTRkYixFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDOUIsUUFBSSxFQUFFLE1BQU0sSUFBSSxPQUFPLENBQUEsQUFBQyxFQUFFO0FBQ3hCLGFBQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ3JCO0FBQ0QsUUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ2xCLGFBQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0tBQzFCOztBQUVELFFBQUksUUFBUSxZQUFBLENBQUM7O0FBRWIsYUFBUyxZQUFZLEdBQUc7QUFDdEIsVUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO1VBQy9CLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztVQUN0RCxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0YsYUFBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ25DOzs7QUFHRCxhQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQ2pDLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixnQkFBUSxHQUFHLFlBQVksRUFBRSxDQUFDO09BQzNCO0FBQ0QsYUFBTyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDbEQ7QUFDRCxPQUFHLENBQUMsTUFBTSxHQUFHLFVBQVMsWUFBWSxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixnQkFBUSxHQUFHLFlBQVksRUFBRSxDQUFDO09BQzNCO0FBQ0QsYUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ3RDLENBQUM7QUFDRixPQUFHLENBQUMsTUFBTSxHQUFHLFVBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFO0FBQ2xELFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixnQkFBUSxHQUFHLFlBQVksRUFBRSxDQUFDO09BQzNCO0FBQ0QsYUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3RELENBQUM7QUFDRixXQUFPLEdBQUcsQ0FBQztHQUNaOztBQUVELFdBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdkIsUUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ1gsYUFBTyxJQUFJLENBQUM7S0FDYjs7QUFFRCxRQUFJLE9BeGdCRSxPQUFPLENBd2dCRCxDQUFDLENBQUMsSUFBSSxPQXhnQlosT0FBTyxDQXdnQmEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3JELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2pDLFlBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzFCLGlCQUFPLEtBQUssQ0FBQztTQUNkO09BQ0Y7QUFDRCxhQUFPLElBQUksQ0FBQztLQUNiO0dBQ0Y7O0FBRUQsV0FBUyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUU7QUFDckMsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7OztBQUd6QixXQUFLLENBQUMsSUFBSSxHQUFHO0FBQ1gsWUFBSSxFQUFFLGdCQUFnQjtBQUN0QixZQUFJLEVBQUUsS0FBSztBQUNYLGFBQUssRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDOUIsZ0JBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxHQUFHLEVBQUU7QUFDL0IsV0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO09BQ2pCLENBQUM7S0FDSDtHQUNGIiwiZmlsZSI6ImNvbXBpbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuXG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4uL2V4Y2VwdGlvbic7XG5pbXBvcnQge2lzQXJyYXksIGluZGV4T2YsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEFTVCBmcm9tICcuL2FzdCc7XG5cbmNvbnN0IHNsaWNlID0gW10uc2xpY2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb21waWxlcigpIHt9XG5cbi8vIHRoZSBmb3VuZEhlbHBlciByZWdpc3RlciB3aWxsIGRpc2FtYmlndWF0ZSBoZWxwZXIgbG9va3VwIGZyb20gZmluZGluZyBhXG4vLyBmdW5jdGlvbiBpbiBhIGNvbnRleHQuIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBtdXN0YWNoZSBjb21wYXRpYmlsaXR5LCB3aGljaFxuLy8gcmVxdWlyZXMgdGhhdCBjb250ZXh0IGZ1bmN0aW9ucyBpbiBibG9ja3MgYXJlIGV2YWx1YXRlZCBieSBibG9ja0hlbHBlck1pc3NpbmcsXG4vLyBhbmQgdGhlbiBwcm9jZWVkIGFzIGlmIHRoZSByZXN1bHRpbmcgdmFsdWUgd2FzIHByb3ZpZGVkIHRvIGJsb2NrSGVscGVyTWlzc2luZy5cblxuQ29tcGlsZXIucHJvdG90eXBlID0ge1xuICBjb21waWxlcjogQ29tcGlsZXIsXG5cbiAgZXF1YWxzOiBmdW5jdGlvbihvdGhlcikge1xuICAgIGxldCBsZW4gPSB0aGlzLm9wY29kZXMubGVuZ3RoO1xuICAgIGlmIChvdGhlci5vcGNvZGVzLmxlbmd0aCAhPT0gbGVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IG9wY29kZSA9IHRoaXMub3Bjb2Rlc1tpXSxcbiAgICAgICAgICBvdGhlck9wY29kZSA9IG90aGVyLm9wY29kZXNbaV07XG4gICAgICBpZiAob3Bjb2RlLm9wY29kZSAhPT0gb3RoZXJPcGNvZGUub3Bjb2RlIHx8ICFhcmdFcXVhbHMob3Bjb2RlLmFyZ3MsIG90aGVyT3Bjb2RlLmFyZ3MpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBrbm93IHRoYXQgbGVuZ3RoIGlzIHRoZSBzYW1lIGJldHdlZW4gdGhlIHR3byBhcnJheXMgYmVjYXVzZSB0aGV5IGFyZSBkaXJlY3RseSB0aWVkXG4gICAgLy8gdG8gdGhlIG9wY29kZSBiZWhhdmlvciBhYm92ZS5cbiAgICBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoIXRoaXMuY2hpbGRyZW5baV0uZXF1YWxzKG90aGVyLmNoaWxkcmVuW2ldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZ3VpZDogMCxcblxuICBjb21waWxlOiBmdW5jdGlvbihwcm9ncmFtLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zb3VyY2VOb2RlID0gW107XG4gICAgdGhpcy5vcGNvZGVzID0gW107XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5zdHJpbmdQYXJhbXMgPSBvcHRpb25zLnN0cmluZ1BhcmFtcztcbiAgICB0aGlzLnRyYWNrSWRzID0gb3B0aW9ucy50cmFja0lkcztcblxuICAgIG9wdGlvbnMuYmxvY2tQYXJhbXMgPSBvcHRpb25zLmJsb2NrUGFyYW1zIHx8IFtdO1xuXG4gICAgb3B0aW9ucy5rbm93bkhlbHBlcnMgPSBleHRlbmQoT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuICAgICAgJ2hlbHBlck1pc3NpbmcnOiB0cnVlLFxuICAgICAgJ2Jsb2NrSGVscGVyTWlzc2luZyc6IHRydWUsXG4gICAgICAnZWFjaCc6IHRydWUsXG4gICAgICAnaWYnOiB0cnVlLFxuICAgICAgJ3VubGVzcyc6IHRydWUsXG4gICAgICAnd2l0aCc6IHRydWUsXG4gICAgICAnbG9nJzogdHJ1ZSxcbiAgICAgICdsb29rdXAnOiB0cnVlXG4gICAgfSwgb3B0aW9ucy5rbm93bkhlbHBlcnMpO1xuXG4gICAgcmV0dXJuIHRoaXMuYWNjZXB0KHByb2dyYW0pO1xuICB9LFxuXG4gIGNvbXBpbGVQcm9ncmFtOiBmdW5jdGlvbihwcm9ncmFtKSB7XG4gICAgbGV0IGNoaWxkQ29tcGlsZXIgPSBuZXcgdGhpcy5jb21waWxlcigpLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcbiAgICAgICAgcmVzdWx0ID0gY2hpbGRDb21waWxlci5jb21waWxlKHByb2dyYW0sIHRoaXMub3B0aW9ucyksXG4gICAgICAgIGd1aWQgPSB0aGlzLmd1aWQrKztcblxuICAgIHRoaXMudXNlUGFydGlhbCA9IHRoaXMudXNlUGFydGlhbCB8fCByZXN1bHQudXNlUGFydGlhbDtcblxuICAgIHRoaXMuY2hpbGRyZW5bZ3VpZF0gPSByZXN1bHQ7XG4gICAgdGhpcy51c2VEZXB0aHMgPSB0aGlzLnVzZURlcHRocyB8fCByZXN1bHQudXNlRGVwdGhzO1xuXG4gICAgcmV0dXJuIGd1aWQ7XG4gIH0sXG5cbiAgYWNjZXB0OiBmdW5jdGlvbihub2RlKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IFNhbml0eSBjb2RlICovXG4gICAgaWYgKCF0aGlzW25vZGUudHlwZV0pIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1Vua25vd24gdHlwZTogJyArIG5vZGUudHlwZSwgbm9kZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zb3VyY2VOb2RlLnVuc2hpZnQobm9kZSk7XG4gICAgbGV0IHJldCA9IHRoaXNbbm9kZS50eXBlXShub2RlKTtcbiAgICB0aGlzLnNvdXJjZU5vZGUuc2hpZnQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIFByb2dyYW06IGZ1bmN0aW9uKHByb2dyYW0pIHtcbiAgICB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXMudW5zaGlmdChwcm9ncmFtLmJsb2NrUGFyYW1zKTtcblxuICAgIGxldCBib2R5ID0gcHJvZ3JhbS5ib2R5LFxuICAgICAgICBib2R5TGVuZ3RoID0gYm9keS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2R5TGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYWNjZXB0KGJvZHlbaV0pO1xuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5ibG9ja1BhcmFtcy5zaGlmdCgpO1xuXG4gICAgdGhpcy5pc1NpbXBsZSA9IGJvZHlMZW5ndGggPT09IDE7XG4gICAgdGhpcy5ibG9ja1BhcmFtcyA9IHByb2dyYW0uYmxvY2tQYXJhbXMgPyBwcm9ncmFtLmJsb2NrUGFyYW1zLmxlbmd0aCA6IDA7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBCbG9ja1N0YXRlbWVudDogZnVuY3Rpb24oYmxvY2spIHtcbiAgICB0cmFuc2Zvcm1MaXRlcmFsVG9QYXRoKGJsb2NrKTtcblxuICAgIGxldCBwcm9ncmFtID0gYmxvY2sucHJvZ3JhbSxcbiAgICAgICAgaW52ZXJzZSA9IGJsb2NrLmludmVyc2U7XG5cbiAgICBwcm9ncmFtID0gcHJvZ3JhbSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIGludmVyc2UgPSBpbnZlcnNlICYmIHRoaXMuY29tcGlsZVByb2dyYW0oaW52ZXJzZSk7XG5cbiAgICBsZXQgdHlwZSA9IHRoaXMuY2xhc3NpZnlTZXhwcihibG9jayk7XG5cbiAgICBpZiAodHlwZSA9PT0gJ2hlbHBlcicpIHtcbiAgICAgIHRoaXMuaGVscGVyU2V4cHIoYmxvY2ssIHByb2dyYW0sIGludmVyc2UpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3NpbXBsZScpIHtcbiAgICAgIHRoaXMuc2ltcGxlU2V4cHIoYmxvY2spO1xuXG4gICAgICAvLyBub3cgdGhhdCB0aGUgc2ltcGxlIG11c3RhY2hlIGlzIHJlc29sdmVkLCB3ZSBuZWVkIHRvXG4gICAgICAvLyBldmFsdWF0ZSBpdCBieSBleGVjdXRpbmcgYGJsb2NrSGVscGVyTWlzc2luZ2BcbiAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIHByb2dyYW0pO1xuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG4gICAgICB0aGlzLm9wY29kZSgnZW1wdHlIYXNoJyk7XG4gICAgICB0aGlzLm9wY29kZSgnYmxvY2tWYWx1ZScsIGJsb2NrLnBhdGgub3JpZ2luYWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFtYmlndW91c1NleHByKGJsb2NrLCBwcm9ncmFtLCBpbnZlcnNlKTtcblxuICAgICAgLy8gbm93IHRoYXQgdGhlIHNpbXBsZSBtdXN0YWNoZSBpcyByZXNvbHZlZCwgd2UgbmVlZCB0b1xuICAgICAgLy8gZXZhbHVhdGUgaXQgYnkgZXhlY3V0aW5nIGBibG9ja0hlbHBlck1pc3NpbmdgXG4gICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIGludmVyc2UpO1xuICAgICAgdGhpcy5vcGNvZGUoJ2VtcHR5SGFzaCcpO1xuICAgICAgdGhpcy5vcGNvZGUoJ2FtYmlndW91c0Jsb2NrVmFsdWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLm9wY29kZSgnYXBwZW5kJyk7XG4gIH0sXG5cbiAgRGVjb3JhdG9yQmxvY2soZGVjb3JhdG9yKSB7XG4gICAgbGV0IHByb2dyYW0gPSBkZWNvcmF0b3IucHJvZ3JhbSAmJiB0aGlzLmNvbXBpbGVQcm9ncmFtKGRlY29yYXRvci5wcm9ncmFtKTtcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5zZXR1cEZ1bGxNdXN0YWNoZVBhcmFtcyhkZWNvcmF0b3IsIHByb2dyYW0sIHVuZGVmaW5lZCksXG4gICAgICAgIHBhdGggPSBkZWNvcmF0b3IucGF0aDtcblxuICAgIHRoaXMudXNlRGVjb3JhdG9ycyA9IHRydWU7XG4gICAgdGhpcy5vcGNvZGUoJ3JlZ2lzdGVyRGVjb3JhdG9yJywgcGFyYW1zLmxlbmd0aCwgcGF0aC5vcmlnaW5hbCk7XG4gIH0sXG5cbiAgUGFydGlhbFN0YXRlbWVudDogZnVuY3Rpb24ocGFydGlhbCkge1xuICAgIHRoaXMudXNlUGFydGlhbCA9IHRydWU7XG5cbiAgICBsZXQgcHJvZ3JhbSA9IHBhcnRpYWwucHJvZ3JhbTtcbiAgICBpZiAocHJvZ3JhbSkge1xuICAgICAgcHJvZ3JhbSA9IHRoaXMuY29tcGlsZVByb2dyYW0ocGFydGlhbC5wcm9ncmFtKTtcbiAgICB9XG5cbiAgICBsZXQgcGFyYW1zID0gcGFydGlhbC5wYXJhbXM7XG4gICAgaWYgKHBhcmFtcy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbnN1cHBvcnRlZCBudW1iZXIgb2YgcGFydGlhbCBhcmd1bWVudHM6ICcgKyBwYXJhbXMubGVuZ3RoLCBwYXJ0aWFsKTtcbiAgICB9IGVsc2UgaWYgKCFwYXJhbXMubGVuZ3RoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmV4cGxpY2l0UGFydGlhbENvbnRleHQpIHtcbiAgICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgJ3VuZGVmaW5lZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYW1zLnB1c2goe3R5cGU6ICdQYXRoRXhwcmVzc2lvbicsIHBhcnRzOiBbXSwgZGVwdGg6IDB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcGFydGlhbE5hbWUgPSBwYXJ0aWFsLm5hbWUub3JpZ2luYWwsXG4gICAgICAgIGlzRHluYW1pYyA9IHBhcnRpYWwubmFtZS50eXBlID09PSAnU3ViRXhwcmVzc2lvbic7XG4gICAgaWYgKGlzRHluYW1pYykge1xuICAgICAgdGhpcy5hY2NlcHQocGFydGlhbC5uYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldHVwRnVsbE11c3RhY2hlUGFyYW1zKHBhcnRpYWwsIHByb2dyYW0sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICBsZXQgaW5kZW50ID0gcGFydGlhbC5pbmRlbnQgfHwgJyc7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wcmV2ZW50SW5kZW50ICYmIGluZGVudCkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZENvbnRlbnQnLCBpbmRlbnQpO1xuICAgICAgaW5kZW50ID0gJyc7XG4gICAgfVxuXG4gICAgdGhpcy5vcGNvZGUoJ2ludm9rZVBhcnRpYWwnLCBpc0R5bmFtaWMsIHBhcnRpYWxOYW1lLCBpbmRlbnQpO1xuICAgIHRoaXMub3Bjb2RlKCdhcHBlbmQnKTtcbiAgfSxcbiAgUGFydGlhbEJsb2NrU3RhdGVtZW50OiBmdW5jdGlvbihwYXJ0aWFsQmxvY2spIHtcbiAgICB0aGlzLlBhcnRpYWxTdGF0ZW1lbnQocGFydGlhbEJsb2NrKTtcbiAgfSxcblxuICBNdXN0YWNoZVN0YXRlbWVudDogZnVuY3Rpb24obXVzdGFjaGUpIHtcbiAgICB0aGlzLlN1YkV4cHJlc3Npb24obXVzdGFjaGUpO1xuXG4gICAgaWYgKG11c3RhY2hlLmVzY2FwZWQgJiYgIXRoaXMub3B0aW9ucy5ub0VzY2FwZSkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZEVzY2FwZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuICAgIH1cbiAgfSxcbiAgRGVjb3JhdG9yKGRlY29yYXRvcikge1xuICAgIHRoaXMuRGVjb3JhdG9yQmxvY2soZGVjb3JhdG9yKTtcbiAgfSxcblxuXG4gIENvbnRlbnRTdGF0ZW1lbnQ6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgICBpZiAoY29udGVudC52YWx1ZSkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZENvbnRlbnQnLCBjb250ZW50LnZhbHVlKTtcbiAgICB9XG4gIH0sXG5cbiAgQ29tbWVudFN0YXRlbWVudDogZnVuY3Rpb24oKSB7fSxcblxuICBTdWJFeHByZXNzaW9uOiBmdW5jdGlvbihzZXhwcikge1xuICAgIHRyYW5zZm9ybUxpdGVyYWxUb1BhdGgoc2V4cHIpO1xuICAgIGxldCB0eXBlID0gdGhpcy5jbGFzc2lmeVNleHByKHNleHByKTtcblxuICAgIGlmICh0eXBlID09PSAnc2ltcGxlJykge1xuICAgICAgdGhpcy5zaW1wbGVTZXhwcihzZXhwcik7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnaGVscGVyJykge1xuICAgICAgdGhpcy5oZWxwZXJTZXhwcihzZXhwcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYW1iaWd1b3VzU2V4cHIoc2V4cHIpO1xuICAgIH1cbiAgfSxcbiAgYW1iaWd1b3VzU2V4cHI6IGZ1bmN0aW9uKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSB7XG4gICAgbGV0IHBhdGggPSBzZXhwci5wYXRoLFxuICAgICAgICBuYW1lID0gcGF0aC5wYXJ0c1swXSxcbiAgICAgICAgaXNCbG9jayA9IHByb2dyYW0gIT0gbnVsbCB8fCBpbnZlcnNlICE9IG51bGw7XG5cbiAgICB0aGlzLm9wY29kZSgnZ2V0Q29udGV4dCcsIHBhdGguZGVwdGgpO1xuXG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cbiAgICBwYXRoLnN0cmljdCA9IHRydWU7XG4gICAgdGhpcy5hY2NlcHQocGF0aCk7XG5cbiAgICB0aGlzLm9wY29kZSgnaW52b2tlQW1iaWd1b3VzJywgbmFtZSwgaXNCbG9jayk7XG4gIH0sXG5cbiAgc2ltcGxlU2V4cHI6IGZ1bmN0aW9uKHNleHByKSB7XG4gICAgbGV0IHBhdGggPSBzZXhwci5wYXRoO1xuICAgIHBhdGguc3RyaWN0ID0gdHJ1ZTtcbiAgICB0aGlzLmFjY2VwdChwYXRoKTtcbiAgICB0aGlzLm9wY29kZSgncmVzb2x2ZVBvc3NpYmxlTGFtYmRhJyk7XG4gIH0sXG5cbiAgaGVscGVyU2V4cHI6IGZ1bmN0aW9uKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSB7XG4gICAgbGV0IHBhcmFtcyA9IHRoaXMuc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXMoc2V4cHIsIHByb2dyYW0sIGludmVyc2UpLFxuICAgICAgICBwYXRoID0gc2V4cHIucGF0aCxcbiAgICAgICAgbmFtZSA9IHBhdGgucGFydHNbMF07XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmtub3duSGVscGVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2ludm9rZUtub3duSGVscGVyJywgcGFyYW1zLmxlbmd0aCwgbmFtZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMua25vd25IZWxwZXJzT25seSkge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignWW91IHNwZWNpZmllZCBrbm93bkhlbHBlcnNPbmx5LCBidXQgdXNlZCB0aGUgdW5rbm93biBoZWxwZXIgJyArIG5hbWUsIHNleHByKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aC5zdHJpY3QgPSB0cnVlO1xuICAgICAgcGF0aC5mYWxzeSA9IHRydWU7XG5cbiAgICAgIHRoaXMuYWNjZXB0KHBhdGgpO1xuICAgICAgdGhpcy5vcGNvZGUoJ2ludm9rZUhlbHBlcicsIHBhcmFtcy5sZW5ndGgsIHBhdGgub3JpZ2luYWwsIEFTVC5oZWxwZXJzLnNpbXBsZUlkKHBhdGgpKTtcbiAgICB9XG4gIH0sXG5cbiAgUGF0aEV4cHJlc3Npb246IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICB0aGlzLmFkZERlcHRoKHBhdGguZGVwdGgpO1xuICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgcGF0aC5kZXB0aCk7XG5cbiAgICBsZXQgbmFtZSA9IHBhdGgucGFydHNbMF0sXG4gICAgICAgIHNjb3BlZCA9IEFTVC5oZWxwZXJzLnNjb3BlZElkKHBhdGgpLFxuICAgICAgICBibG9ja1BhcmFtSWQgPSAhcGF0aC5kZXB0aCAmJiAhc2NvcGVkICYmIHRoaXMuYmxvY2tQYXJhbUluZGV4KG5hbWUpO1xuXG4gICAgaWYgKGJsb2NrUGFyYW1JZCkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2xvb2t1cEJsb2NrUGFyYW0nLCBibG9ja1BhcmFtSWQsIHBhdGgucGFydHMpO1xuICAgIH0gZWxzZSBpZiAoIW5hbWUpIHtcbiAgICAgIC8vIENvbnRleHQgcmVmZXJlbmNlLCBpLmUuIGB7e2ZvbyAufX1gIG9yIGB7e2ZvbyAuLn19YFxuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hDb250ZXh0Jyk7XG4gICAgfSBlbHNlIGlmIChwYXRoLmRhdGEpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gdHJ1ZTtcbiAgICAgIHRoaXMub3Bjb2RlKCdsb29rdXBEYXRhJywgcGF0aC5kZXB0aCwgcGF0aC5wYXJ0cywgcGF0aC5zdHJpY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wY29kZSgnbG9va3VwT25Db250ZXh0JywgcGF0aC5wYXJ0cywgcGF0aC5mYWxzeSwgcGF0aC5zdHJpY3QsIHNjb3BlZCk7XG4gICAgfVxuICB9LFxuXG4gIFN0cmluZ0xpdGVyYWw6IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIHRoaXMub3Bjb2RlKCdwdXNoU3RyaW5nJywgc3RyaW5nLnZhbHVlKTtcbiAgfSxcblxuICBOdW1iZXJMaXRlcmFsOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCBudW1iZXIudmFsdWUpO1xuICB9LFxuXG4gIEJvb2xlYW5MaXRlcmFsOiBmdW5jdGlvbihib29sKSB7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgYm9vbC52YWx1ZSk7XG4gIH0sXG5cbiAgVW5kZWZpbmVkTGl0ZXJhbDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgJ3VuZGVmaW5lZCcpO1xuICB9LFxuXG4gIE51bGxMaXRlcmFsOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9wY29kZSgncHVzaExpdGVyYWwnLCAnbnVsbCcpO1xuICB9LFxuXG4gIEhhc2g6IGZ1bmN0aW9uKGhhc2gpIHtcbiAgICBsZXQgcGFpcnMgPSBoYXNoLnBhaXJzLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbCA9IHBhaXJzLmxlbmd0aDtcblxuICAgIHRoaXMub3Bjb2RlKCdwdXNoSGFzaCcpO1xuXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMucHVzaFBhcmFtKHBhaXJzW2ldLnZhbHVlKTtcbiAgICB9XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2Fzc2lnblRvSGFzaCcsIHBhaXJzW2ldLmtleSk7XG4gICAgfVxuICAgIHRoaXMub3Bjb2RlKCdwb3BIYXNoJyk7XG4gIH0sXG5cbiAgLy8gSEVMUEVSU1xuICBvcGNvZGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLm9wY29kZXMucHVzaCh7IG9wY29kZTogbmFtZSwgYXJnczogc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBsb2M6IHRoaXMuc291cmNlTm9kZVswXS5sb2MgfSk7XG4gIH0sXG5cbiAgYWRkRGVwdGg6IGZ1bmN0aW9uKGRlcHRoKSB7XG4gICAgaWYgKCFkZXB0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXNlRGVwdGhzID0gdHJ1ZTtcbiAgfSxcblxuICBjbGFzc2lmeVNleHByOiBmdW5jdGlvbihzZXhwcikge1xuICAgIGxldCBpc1NpbXBsZSA9IEFTVC5oZWxwZXJzLnNpbXBsZUlkKHNleHByLnBhdGgpO1xuXG4gICAgbGV0IGlzQmxvY2tQYXJhbSA9IGlzU2ltcGxlICYmICEhdGhpcy5ibG9ja1BhcmFtSW5kZXgoc2V4cHIucGF0aC5wYXJ0c1swXSk7XG5cbiAgICAvLyBhIG11c3RhY2hlIGlzIGFuIGVsaWdpYmxlIGhlbHBlciBpZjpcbiAgICAvLyAqIGl0cyBpZCBpcyBzaW1wbGUgKGEgc2luZ2xlIHBhcnQsIG5vdCBgdGhpc2Agb3IgYC4uYClcbiAgICBsZXQgaXNIZWxwZXIgPSAhaXNCbG9ja1BhcmFtICYmIEFTVC5oZWxwZXJzLmhlbHBlckV4cHJlc3Npb24oc2V4cHIpO1xuXG4gICAgLy8gaWYgYSBtdXN0YWNoZSBpcyBhbiBlbGlnaWJsZSBoZWxwZXIgYnV0IG5vdCBhIGRlZmluaXRlXG4gICAgLy8gaGVscGVyLCBpdCBpcyBhbWJpZ3VvdXMsIGFuZCB3aWxsIGJlIHJlc29sdmVkIGluIGEgbGF0ZXJcbiAgICAvLyBwYXNzIG9yIGF0IHJ1bnRpbWUuXG4gICAgbGV0IGlzRWxpZ2libGUgPSAhaXNCbG9ja1BhcmFtICYmIChpc0hlbHBlciB8fCBpc1NpbXBsZSk7XG5cbiAgICAvLyBpZiBhbWJpZ3VvdXMsIHdlIGNhbiBwb3NzaWJseSByZXNvbHZlIHRoZSBhbWJpZ3VpdHkgbm93XG4gICAgLy8gQW4gZWxpZ2libGUgaGVscGVyIGlzIG9uZSB0aGF0IGRvZXMgbm90IGhhdmUgYSBjb21wbGV4IHBhdGgsIGkuZS4gYHRoaXMuZm9vYCwgYC4uL2Zvb2AgZXRjLlxuICAgIGlmIChpc0VsaWdpYmxlICYmICFpc0hlbHBlcikge1xuICAgICAgbGV0IG5hbWUgPSBzZXhwci5wYXRoLnBhcnRzWzBdLFxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAob3B0aW9ucy5rbm93bkhlbHBlcnNbbmFtZV0pIHtcbiAgICAgICAgaXNIZWxwZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmtub3duSGVscGVyc09ubHkpIHtcbiAgICAgICAgaXNFbGlnaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0hlbHBlcikge1xuICAgICAgcmV0dXJuICdoZWxwZXInO1xuICAgIH0gZWxzZSBpZiAoaXNFbGlnaWJsZSkge1xuICAgICAgcmV0dXJuICdhbWJpZ3VvdXMnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ3NpbXBsZSc7XG4gICAgfVxuICB9LFxuXG4gIHB1c2hQYXJhbXM6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcGFyYW1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5wdXNoUGFyYW0ocGFyYW1zW2ldKTtcbiAgICB9XG4gIH0sXG5cbiAgcHVzaFBhcmFtOiBmdW5jdGlvbih2YWwpIHtcbiAgICBsZXQgdmFsdWUgPSB2YWwudmFsdWUgIT0gbnVsbCA/IHZhbC52YWx1ZSA6IHZhbC5vcmlnaW5hbCB8fCAnJztcblxuICAgIGlmICh0aGlzLnN0cmluZ1BhcmFtcykge1xuICAgICAgaWYgKHZhbHVlLnJlcGxhY2UpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVxuICAgICAgICAgICAgLnJlcGxhY2UoL14oXFwuP1xcLlxcLykqL2csICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCAnLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsLmRlcHRoKSB7XG4gICAgICAgIHRoaXMuYWRkRGVwdGgodmFsLmRlcHRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgdmFsLmRlcHRoIHx8IDApO1xuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hTdHJpbmdQYXJhbScsIHZhbHVlLCB2YWwudHlwZSk7XG5cbiAgICAgIGlmICh2YWwudHlwZSA9PT0gJ1N1YkV4cHJlc3Npb24nKSB7XG4gICAgICAgIC8vIFN1YkV4cHJlc3Npb25zIGdldCBldmFsdWF0ZWQgYW5kIHBhc3NlZCBpblxuICAgICAgICAvLyBpbiBzdHJpbmcgcGFyYW1zIG1vZGUuXG4gICAgICAgIHRoaXMuYWNjZXB0KHZhbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnRyYWNrSWRzKSB7XG4gICAgICAgIGxldCBibG9ja1BhcmFtSW5kZXg7XG4gICAgICAgIGlmICh2YWwucGFydHMgJiYgIUFTVC5oZWxwZXJzLnNjb3BlZElkKHZhbCkgJiYgIXZhbC5kZXB0aCkge1xuICAgICAgICAgICBibG9ja1BhcmFtSW5kZXggPSB0aGlzLmJsb2NrUGFyYW1JbmRleCh2YWwucGFydHNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChibG9ja1BhcmFtSW5kZXgpIHtcbiAgICAgICAgICBsZXQgYmxvY2tQYXJhbUNoaWxkID0gdmFsLnBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKTtcbiAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgJ0Jsb2NrUGFyYW0nLCBibG9ja1BhcmFtSW5kZXgsIGJsb2NrUGFyYW1DaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWwub3JpZ2luYWwgfHwgdmFsdWU7XG4gICAgICAgICAgaWYgKHZhbHVlLnJlcGxhY2UpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXnRoaXMoPzpcXC58JCkvLCAnJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLlxcLy8sICcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwuJC8sICcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm9wY29kZSgncHVzaElkJywgdmFsLnR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hY2NlcHQodmFsKTtcbiAgICB9XG4gIH0sXG5cbiAgc2V0dXBGdWxsTXVzdGFjaGVQYXJhbXM6IGZ1bmN0aW9uKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlLCBvbWl0RW1wdHkpIHtcbiAgICBsZXQgcGFyYW1zID0gc2V4cHIucGFyYW1zO1xuICAgIHRoaXMucHVzaFBhcmFtcyhwYXJhbXMpO1xuXG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cbiAgICBpZiAoc2V4cHIuaGFzaCkge1xuICAgICAgdGhpcy5hY2NlcHQoc2V4cHIuaGFzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnLCBvbWl0RW1wdHkpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH0sXG5cbiAgYmxvY2tQYXJhbUluZGV4OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZm9yIChsZXQgZGVwdGggPSAwLCBsZW4gPSB0aGlzLm9wdGlvbnMuYmxvY2tQYXJhbXMubGVuZ3RoOyBkZXB0aCA8IGxlbjsgZGVwdGgrKykge1xuICAgICAgbGV0IGJsb2NrUGFyYW1zID0gdGhpcy5vcHRpb25zLmJsb2NrUGFyYW1zW2RlcHRoXSxcbiAgICAgICAgICBwYXJhbSA9IGJsb2NrUGFyYW1zICYmIGluZGV4T2YoYmxvY2tQYXJhbXMsIG5hbWUpO1xuICAgICAgaWYgKGJsb2NrUGFyYW1zICYmIHBhcmFtID49IDApIHtcbiAgICAgICAgcmV0dXJuIFtkZXB0aCwgcGFyYW1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHByZWNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGVudikge1xuICBpZiAoaW5wdXQgPT0gbnVsbCB8fCAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyAmJiBpbnB1dC50eXBlICE9PSAnUHJvZ3JhbScpKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignWW91IG11c3QgcGFzcyBhIHN0cmluZyBvciBIYW5kbGViYXJzIEFTVCB0byBIYW5kbGViYXJzLnByZWNvbXBpbGUuIFlvdSBwYXNzZWQgJyArIGlucHV0KTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoISgnZGF0YScgaW4gb3B0aW9ucykpIHtcbiAgICBvcHRpb25zLmRhdGEgPSB0cnVlO1xuICB9XG4gIGlmIChvcHRpb25zLmNvbXBhdCkge1xuICAgIG9wdGlvbnMudXNlRGVwdGhzID0gdHJ1ZTtcbiAgfVxuXG4gIGxldCBhc3QgPSBlbnYucGFyc2UoaW5wdXQsIG9wdGlvbnMpLFxuICAgICAgZW52aXJvbm1lbnQgPSBuZXcgZW52LkNvbXBpbGVyKCkuY29tcGlsZShhc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gbmV3IGVudi5KYXZhU2NyaXB0Q29tcGlsZXIoKS5jb21waWxlKGVudmlyb25tZW50LCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoaW5wdXQsIG9wdGlvbnMgPSB7fSwgZW52KSB7XG4gIGlmIChpbnB1dCA9PSBudWxsIHx8ICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnICYmIGlucHV0LnR5cGUgIT09ICdQcm9ncmFtJykpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdZb3UgbXVzdCBwYXNzIGEgc3RyaW5nIG9yIEhhbmRsZWJhcnMgQVNUIHRvIEhhbmRsZWJhcnMuY29tcGlsZS4gWW91IHBhc3NlZCAnICsgaW5wdXQpO1xuICB9XG5cbiAgb3B0aW9ucyA9IGV4dGVuZCh7fSwgb3B0aW9ucyk7XG4gIGlmICghKCdkYXRhJyBpbiBvcHRpb25zKSkge1xuICAgIG9wdGlvbnMuZGF0YSA9IHRydWU7XG4gIH1cbiAgaWYgKG9wdGlvbnMuY29tcGF0KSB7XG4gICAgb3B0aW9ucy51c2VEZXB0aHMgPSB0cnVlO1xuICB9XG5cbiAgbGV0IGNvbXBpbGVkO1xuXG4gIGZ1bmN0aW9uIGNvbXBpbGVJbnB1dCgpIHtcbiAgICBsZXQgYXN0ID0gZW52LnBhcnNlKGlucHV0LCBvcHRpb25zKSxcbiAgICAgICAgZW52aXJvbm1lbnQgPSBuZXcgZW52LkNvbXBpbGVyKCkuY29tcGlsZShhc3QsIG9wdGlvbnMpLFxuICAgICAgICB0ZW1wbGF0ZVNwZWMgPSBuZXcgZW52LkphdmFTY3JpcHRDb21waWxlcigpLmNvbXBpbGUoZW52aXJvbm1lbnQsIG9wdGlvbnMsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgcmV0dXJuIGVudi50ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgLy8gVGVtcGxhdGUgaXMgb25seSBjb21waWxlZCBvbiBmaXJzdCB1c2UgYW5kIGNhY2hlZCBhZnRlciB0aGF0IHBvaW50LlxuICBmdW5jdGlvbiByZXQoY29udGV4dCwgZXhlY09wdGlvbnMpIHtcbiAgICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgICBjb21waWxlZCA9IGNvbXBpbGVJbnB1dCgpO1xuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZWQuY2FsbCh0aGlzLCBjb250ZXh0LCBleGVjT3B0aW9ucyk7XG4gIH1cbiAgcmV0Ll9zZXR1cCA9IGZ1bmN0aW9uKHNldHVwT3B0aW9ucykge1xuICAgIGlmICghY29tcGlsZWQpIHtcbiAgICAgIGNvbXBpbGVkID0gY29tcGlsZUlucHV0KCk7XG4gICAgfVxuICAgIHJldHVybiBjb21waWxlZC5fc2V0dXAoc2V0dXBPcHRpb25zKTtcbiAgfTtcbiAgcmV0Ll9jaGlsZCA9IGZ1bmN0aW9uKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgICBpZiAoIWNvbXBpbGVkKSB7XG4gICAgICBjb21waWxlZCA9IGNvbXBpbGVJbnB1dCgpO1xuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZWQuX2NoaWxkKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICB9O1xuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBhcmdFcXVhbHMoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoYSkgJiYgaXNBcnJheShiKSAmJiBhLmxlbmd0aCA9PT0gYi5sZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghYXJnRXF1YWxzKGFbaV0sIGJbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtTGl0ZXJhbFRvUGF0aChzZXhwcikge1xuICBpZiAoIXNleHByLnBhdGgucGFydHMpIHtcbiAgICBsZXQgbGl0ZXJhbCA9IHNleHByLnBhdGg7XG4gICAgLy8gQ2FzdGluZyB0byBzdHJpbmcgaGVyZSB0byBtYWtlIGZhbHNlIGFuZCAwIGxpdGVyYWwgdmFsdWVzIHBsYXkgbmljZWx5IHdpdGggdGhlIHJlc3RcbiAgICAvLyBvZiB0aGUgc3lzdGVtLlxuICAgIHNleHByLnBhdGggPSB7XG4gICAgICB0eXBlOiAnUGF0aEV4cHJlc3Npb24nLFxuICAgICAgZGF0YTogZmFsc2UsXG4gICAgICBkZXB0aDogMCxcbiAgICAgIHBhcnRzOiBbbGl0ZXJhbC5vcmlnaW5hbCArICcnXSxcbiAgICAgIG9yaWdpbmFsOiBsaXRlcmFsLm9yaWdpbmFsICsgJycsXG4gICAgICBsb2M6IGxpdGVyYWwubG9jXG4gICAgfTtcbiAgfVxufVxuIl19
