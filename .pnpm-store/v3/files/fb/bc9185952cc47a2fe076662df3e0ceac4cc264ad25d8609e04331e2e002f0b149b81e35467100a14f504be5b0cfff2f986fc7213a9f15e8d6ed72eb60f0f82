'use strict'

const gStatus = require('g-status')
const del = require('del')
const debug = require('debug')('lint-staged:git')

const execGit = require('./execGit')

let workingCopyTree = null
let indexTree = null
let formattedIndexTree = null

async function writeTree(options) {
  return execGit(['write-tree'], options)
}

async function getDiffForTrees(tree1, tree2, options) {
  debug(`Generating diff between trees ${tree1} and ${tree2}...`)
  return execGit(
    [
      'diff-tree',
      '--ignore-submodules',
      '--binary',
      '--no-color',
      '--no-ext-diff',
      '--unified=0',
      tree1,
      tree2
    ],
    options
  )
}

async function hasPartiallyStagedFiles(options) {
  const { cwd } = options
  const files = await gStatus({ cwd })
  const partiallyStaged = files.filter(
    file =>
      file.index !== ' ' &&
      file.workingTree !== ' ' &&
      file.index !== '?' &&
      file.workingTree !== '?'
  )
  return partiallyStaged.length > 0
}

// eslint-disable-next-line
async function gitStashSave(options) {
  debug('Stashing files...')
  // Save ref to the current index
  indexTree = await writeTree(options)
  // Add working copy changes to index
  await execGit(['add', '.'], options)
  // Save ref to the working copy index
  workingCopyTree = await writeTree(options)
  // Restore the current index
  await execGit(['read-tree', indexTree], options)
  // Remove all modifications
  await execGit(['checkout-index', '-af'], options)
  // await execGit(['clean', '-dfx'], options)
  debug('Done stashing files!')
  return [workingCopyTree, indexTree]
}

async function updateStash(options) {
  formattedIndexTree = await writeTree(options)
  return formattedIndexTree
}

async function applyPatchFor(tree1, tree2, options) {
  const diff = await getDiffForTrees(tree1, tree2, options)
  /**
   * This is crucial for patch to work
   * For some reason, git-apply requires that the patch ends with the newline symbol
   * See http://git.661346.n2.nabble.com/Bug-in-Git-Gui-Creates-corrupt-patch-td2384251.html
   * and https://stackoverflow.com/questions/13223868/how-to-stage-line-by-line-in-git-gui-although-no-newline-at-end-of-file-warnin
   */
  // TODO: Figure out how to test this. For some reason tests were working but in the real env it was failing
  const patch = `${diff}\n` // TODO: This should also work on Windows but test would be good
  if (patch) {
    try {
      /**
       * Apply patch to index. We will apply it with --reject so it it will try apply hunk by hunk
       * We're not interested in failied hunks since this mean that formatting conflicts with user changes
       * and we prioritize user changes over formatter's
       */
      await execGit(
        ['apply', '-v', '--whitespace=nowarn', '--reject', '--recount', '--unidiff-zero'],
        {
          ...options,
          input: patch
        }
      )
    } catch (err) {
      debug('Could not apply patch to the stashed files cleanly')
      debug(err)
      debug('Patch content:')
      debug(patch)
      throw new Error('Could not apply patch to the stashed files cleanly.', err)
    }
  }
}

async function gitStashPop(options) {
  if (workingCopyTree === null) {
    throw new Error('Trying to restore from stash but could not find working copy stash.')
  }

  debug('Restoring working copy')
  // Restore the stashed files in the index
  await execGit(['read-tree', workingCopyTree], options)
  // and sync it to the working copy (i.e. update files on fs)
  await execGit(['checkout-index', '-af'], options)

  // Then, restore the index after working copy is restored
  if (indexTree !== null && formattedIndexTree === null) {
    // Restore changes that were in index if there are no formatting changes
    debug('Restoring index')
    await execGit(['read-tree', indexTree], options)
  } else {
    /**
     * There are formatting changes we want to restore in the index
     * and in the working copy. So we start by restoring the index
     * and after that we'll try to carry as many as possible changes
     * to the working copy by applying the patch with --reject option.
     */
    debug('Restoring index with formatting changes')
    await execGit(['read-tree', formattedIndexTree], options)
    try {
      await applyPatchFor(indexTree, formattedIndexTree, options)
    } catch (err) {
      debug(
        'Found conflicts between formatters and local changes. Formatters changes will be ignored for conflicted hunks.'
      )
      /**
       * Clean up working directory from *.rej files that contain conflicted hanks.
       * These hunks are coming from formatters so we'll just delete them since they are irrelevant.
       */
      try {
        const rejFiles = await del(['*.rej'], options)
        debug('Deleted files and folders:\n', rejFiles.join('\n'))
      } catch (delErr) {
        debug('Error deleting *.rej files', delErr)
      }
    }
  }
  // Clean up references
  workingCopyTree = null
  indexTree = null
  formattedIndexTree = null

  return null
}

module.exports = {
  execGit,
  gitStashSave,
  gitStashPop,
  hasPartiallyStagedFiles,
  updateStash
}
