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
