(function() {

var lunr = require('lunr');
/*
 * Copyright 2018 Rob Hoelz <rob AT hoelz.ro>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var MutableBuilder = function () {
  lunr.Builder.call(this)
}

MutableBuilder.prototype = new lunr.Builder()

MutableBuilder.prototype.build = function build () {
  this.calculateAverageFieldLengths()
  this.createFieldVectors()
  this.createTokenSet()

  return new MutableIndex({
    invertedIndex: this.invertedIndex,
    fieldVectors: this.fieldVectors,
    tokenSet: this.tokenSet,
    fields: Object.keys(this._fields),
    pipeline: this.searchPipeline,
    builder: this
  })
}

MutableBuilder.prototype.remove = function remove (doc) {
  var docRef = doc[this._ref]
  var fields = Object.keys(this._fields)

  var isDirty = false

  for (var i = 0; i < fields.length; i++) {
    var fieldName = fields[i],
        fieldRef = new lunr.FieldRef (docRef, fieldName)

    if (fieldRef in this.fieldTermFrequencies || fieldRef in this.fieldLengths) {
      isDirty = true
    }

    delete this.fieldTermFrequencies[fieldRef]
    delete this.fieldLengths[fieldRef]
  }

  if (!isDirty) {
    return
  }

  this.documentCount -= 1

  // XXX what if a term disappears from the index?
  for (var term in this.invertedIndex) {
    for (var fieldName in this.invertedIndex[term]) { // XXX what about "_index"?
      delete this.invertedIndex[term][fieldName][docRef]
    }
  }
}

MutableBuilder.prototype.toJSON = function toJSON () {
  var fieldRefs = []
  var fieldTermFrequencies = []
  var fieldLengths = []

  for (var fieldRef in this.fieldTermFrequencies) {
    if (this.fieldTermFrequencies.hasOwnProperty(fieldRef)) {
      fieldRefs.push(fieldRef)
      fieldTermFrequencies.push(this.fieldTermFrequencies[fieldRef])
      fieldLengths.push(this.fieldLengths[fieldRef])
    }
  }

  // XXX omit tokenizer for now
  // some properties (invertedIndex, searchPipeline) are omitted
  // from here because they're on the index, and serializing them twice
  // would be redundant
  return {
    _ref: this._ref,
    _fields: this._fields,
    _documents: this._documents,
    fieldRefs: fieldRefs,
    fieldTermFrequencies: fieldTermFrequencies,
    fieldLengths: fieldLengths,
    pipeline: this.pipeline.toJSON(),
    documentCount: this.documentCount,
    _b: this._b, // XXX special (due to precision)?
    _k1: this._k1, // XXX special (due to precision)?
    termIndex: this.termIndex,
    metadataWhitelist: this.metadataWhitelist
  }
}

MutableBuilder.load = function load (serializedBuilder) {
  var builder = new MutableBuilder()

  for (var k in serializedBuilder) {
    if (serializedBuilder.hasOwnProperty(k)) {
      builder[k] = serializedBuilder[k]
      if(k == '_fields' || k == '_documents') {
          var noProtoObject = Object.create(null)
          for(var innerK in builder[k]) {
            noProtoObject[innerK] = builder[k][innerK]
          }
          builder[k] = noProtoObject
      }
    }
  }

  var fieldRefs = builder.fieldRefs
  var fieldTermFrequencies = builder.fieldTermFrequencies
  var fieldLengths = builder.fieldLengths
  delete builder.fieldRefs

  builder.fieldTermFrequencies = {}
  builder.fieldLengths = {}

  for (var i = 0; i < fieldRefs.length; i++) {
    var fieldRef = fieldRefs[i]
    builder.fieldTermFrequencies[fieldRef] = fieldTermFrequencies[i]
    builder.fieldLengths[fieldRef] = fieldLengths[i]
  }

  // builder.tokenizer is initialized to the default by the MutableBuilder
  // constructor
  builder.pipeline = lunr.Pipeline.load(builder.pipeline)

  return builder
}
/*
 * Copyright 2018 Rob Hoelz <rob AT hoelz.ro>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var MutableIndex = function (attrs) {
  lunr.Index.call(this, attrs)
  this.builder = attrs.builder
  this._dirty = false
}

MutableIndex.prototype = new lunr.Index({})

MutableIndex.prototype.add = function add (doc) {
  this.builder.add(doc)
  this._dirty = true
}

MutableIndex.prototype.update = function update (doc) {
  this.remove(doc)
  this.add(doc)
}

MutableIndex.prototype.remove = function remove (doc) {
  this.builder.remove(doc)
  this._dirty = true
}

// XXX rebuilds the entire index =(
// XXX refreshing this from newIndex is kinda wonky =(
MutableIndex.prototype.checkDirty = function checkDirty () {
  if (this._dirty) {
    this._dirty = false
    var newIndex = this.builder.build()
    for (var k in newIndex) {
      if (newIndex.hasOwnProperty(k)) {
        this[k] = newIndex[k]
      }
    }
  }
}

MutableIndex.prototype.toJSON = function toJSON () {
  this.checkDirty()

  // XXX do you need to serialize things that we could calculate post-load via builder.build?
  var json = lunr.Index.prototype.toJSON.call(this)
  json.builder = this.builder.toJSON()
  return json
}

MutableIndex.load = function load (serializedIndex) {
  var index = lunr.Index.load(serializedIndex)
  var mutableIndex = new MutableIndex({})

  for (var k in index) {
    if (index.hasOwnProperty(k)) {
      mutableIndex[k] = index[k]
    }
  }

  mutableIndex.builder = MutableBuilder.load(serializedIndex.builder)
  mutableIndex.builder.invertedIndex = mutableIndex.invertedIndex
  mutableIndex.builder.searchPipeline = mutableIndex.pipeline
  mutableIndex.dirty = false

  return mutableIndex
}

MutableIndex.prototype.query = function query (fn) {
  this.checkDirty()

  return lunr.Index.prototype.query.call(this, fn)
}
/*
 * Copyright 2018 Rob Hoelz <rob AT hoelz.ro>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * A convenience function for configuring and constructing
 * a new mutable lunr Index.
 *
 * A lunr.MutableBuilder instance is created and the pipeline setup
 * with a trimmer, stop word filter and stemmer.
 *
 * This mutable builder object is yielded to the configuration function
 * that is passed as a parameter, allowing the list of fields
 * and other builder parameters to be customised.
 *
 * All documents _must_ be added within the passed config function, but
 * you can always update the index later. ;)
 *
 * @example
 * var idx = lunrMutable(function () {
 *   this.field('title')
 *   this.field('body')
 *   this.ref('id')
 *
 *   documents.forEach(function (doc) {
 *     this.add(doc)
 *   }, this)
 * })
 *
 * index.add({
 *     "title": "new title",
 *     "body": "new body",
 *     "id": "2"
 * })
 *
 * index.remove({ id: "1" });
 *
 * index.update({
 *   "body": "change",
 *   "id": "2"
 * })
 */

var lunrMutable = function (config) {
  var builder = new MutableBuilder();

  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  builder.searchPipeline.add(
    lunr.stemmer
  )

  config.call(builder, builder)
  return builder.build()
}

lunrMutable.version = "2.3.2"

lunrMutable.Builder = MutableBuilder
lunrMutable.Index = MutableIndex
  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.lunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return lunrMutable
  }))
})();
