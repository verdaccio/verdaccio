'use strict'
var compareFunc = require('compare-func')
var conventionalCommitsFilter = require('conventional-commits-filter')
var Handlebars = require('handlebars')
var semver = require('semver')
var _ = require('lodash')
var stringify = require('json-stringify-safe')

function compileTemplates (templates) {
  var main = templates.mainTemplate
  var headerPartial = templates.headerPartial
  var commitPartial = templates.commitPartial
  var footerPartial = templates.footerPartial
  var partials = templates.partials

  if (_.isString(headerPartial)) {
    Handlebars.registerPartial('header', headerPartial)
  }

  if (_.isString(commitPartial)) {
    Handlebars.registerPartial('commit', commitPartial)
  }

  if (_.isString(footerPartial)) {
    Handlebars.registerPartial('footer', footerPartial)
  }

  _.forEach(partials, function (partial, name) {
    if (_.isString(partial)) {
      Handlebars.registerPartial(name, partial)
    }
  })

  return Handlebars.compile(main, {
    noEscape: true
  })
}

function functionify (strOrArr) {
  if (strOrArr && !_.isFunction(strOrArr)) {
    return compareFunc(strOrArr)
  }
  return strOrArr
}

function getCommitGroups (groupBy, commits, groupsSort, commitsSort) {
  var commitGroups = []
  var commitGroupsObj = _.groupBy(commits, function (commit) {
    return commit[groupBy] || ''
  })

  _.forEach(commitGroupsObj, function (commits, title) {
    if (title === '') {
      title = false
    }

    if (commitsSort) {
      commits.sort(commitsSort)
    }

    commitGroups.push({
      title: title,
      commits: commits
    })
  })

  if (groupsSort) {
    commitGroups.sort(groupsSort)
  }

  return commitGroups
}

function getNoteGroups (notes, noteGroupsSort, notesSort) {
  var retGroups = []

  _.forEach(notes, function (note) {
    var title = note.title
    var titleExists = false

    _.forEach(retGroups, function (group) {
      if (group.title === title) {
        titleExists = true
        group.notes.push(note)
        return false
      }
    })

    if (!titleExists) {
      retGroups.push({
        title: title,
        notes: [note]
      })
    }
  })

  if (noteGroupsSort) {
    retGroups.sort(noteGroupsSort)
  }

  if (notesSort) {
    _.forEach(retGroups, function (group) {
      group.notes.sort(notesSort)
    })
  }

  return retGroups
}

function processCommit (chunk, transform, context) {
  var commit

  try {
    chunk = JSON.parse(chunk)
  } catch (e) {}

  commit = _.cloneDeep(chunk)

  if (_.isFunction(transform)) {
    commit = transform(commit, context)

    if (commit) {
      commit.raw = chunk
    }

    return commit
  }

  _.forEach(transform, function (el, path) {
    var value = _.get(commit, path)

    if (_.isFunction(el)) {
      value = el(value, path)
    } else {
      value = el
    }

    _.set(commit, path, value)
  })

  commit.raw = chunk

  return commit
}

function getExtraContext (commits, notes, options) {
  var context = {}

  // group `commits` by `options.groupBy`
  context.commitGroups = getCommitGroups(options.groupBy, commits, options.commitGroupsSort, options.commitsSort)

  // group `notes` for footer
  context.noteGroups = getNoteGroups(notes, options.noteGroupsSort, options.notesSort)

  return context
}

function generate (options, commits, context, keyCommit) {
  var notes = []
  var filteredCommits
  var compiled = compileTemplates(options)

  if (options.ignoreReverted) {
    filteredCommits = conventionalCommitsFilter(commits)
  } else {
    filteredCommits = _.clone(commits)
  }

  _.forEach(filteredCommits, function (commit) {
    _.map(commit.notes, function (note) {
      note.commit = commit

      return note
    })

    notes = notes.concat(commit.notes)
  })

  context = _.merge({}, context, keyCommit, getExtraContext(filteredCommits, notes, options))

  if (keyCommit && keyCommit.committerDate) {
    context.date = keyCommit.committerDate
  }

  if (context.version && semver.valid(context.version)) {
    context.isPatch = context.isPatch || semver.patch(context.version) !== 0
  }

  context = options.finalizeContext(context, options, filteredCommits, keyCommit, commits)
  options.debug('Your final context is:\n' + stringify(context, null, 2))

  return compiled(context)
}

module.exports = {
  compileTemplates: compileTemplates,
  functionify: functionify,
  getCommitGroups: getCommitGroups,
  getNoteGroups: getNoteGroups,
  processCommit: processCommit,
  getExtraContext: getExtraContext,
  generate: generate
}
