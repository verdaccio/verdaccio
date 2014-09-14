# Basic Cakefile for project automation
# 
# @author Alan Hoffmeister <alan@cranic.com.br>
# @version 0.0.1
# @date 2012-12-06 128:41 GMT -3:00
# @license MIT <http://en.wikipedia.org/wiki/MIT_License#License_terms>

util = require 'util'
walker = require 'walk'
wrench = require 'wrench'
exec = require('child_process').exec
fs = require 'fs'

options = 
    source : __dirname + '/src'
    target : __dirname + '/lib'
    convert :
        'coffee' : 'coffee -b --compile --output "{targetDir}" "{sourceFile}"'
    blacklist : ['log']
    watch :
        'coffee' : 'coffee -b --compile --output "{targetDir}" "{sourceFile}"'

totals =
    converted : 0
    deleted : 0
    total : 0
    watched : 0

replace = (str, root, name) ->
    str.replace('{sourceFile}', "#{root}/#{name}").replace('{targetDir}', root);

task 'build', 'Main build task', ->
    util.log "Build started at #{options.source}"
    util.log "Cleaning up the target directory #{options.target}"
    wrench.rmdirSyncRecursive options.target, true
    util.log 'Creating empty target folder.'
    wrench.mkdirSyncRecursive options.target, '0777'
    util.log 'Coping files from source to target.'
    wrench.copyDirSyncRecursive options.source, options.target
    util.log 'Starting to convert files.'
    walk = walker.walk options.target, followLinks: false
    walk.on 'file', (root, stat, next) ->
        totals.total++
        extension = stat.name.split('.').pop()
        if options.blacklist.indexOf(extension) != -1
            fs.unlinkSync "#{root}/#{stat.name}"
            util.log "Removing by blacklist: #{root}/#{stat.name}"
            totals.deleted++
            next()
        else if options.convert[extension]
            util.log "Converting #{root}/#{stat.name}"
            exec replace(options.convert[extension], root, stat.name), (err, stdout, stderr) ->
                throw err if err
                fs.unlinkSync "#{root}/#{stat.name}"
                totals.converted++
                next()

    walk.on 'end', ->
        util.log "Build script ended. #{totals.total} files copyed, #{totals.deleted} deleted and #{totals.converted} converted."

task 'watch', 'Watch for filechanges.', ->
    util.log "Watching files in #{options.source}"
    walk = walker.walk options.source, followLinks: false
    walk.on 'file', (root, stat, next) ->
        extension = stat.name.split('.').pop()
        if options.watch[extension]
            totals.watched++
            util.log "Watching #{root}/#{stat.name}"
            fs.watchFile "#{root}/#{stat.name}", (curt, pret) ->
                util.log "File changed: #{root}/#{stat.name}"
                exec 'cake build', (err, stdout, stderr) ->
                    throw err if err           
        next()
    walk.on 'end', ->
        util.log "Watching #{totals.watched} files."