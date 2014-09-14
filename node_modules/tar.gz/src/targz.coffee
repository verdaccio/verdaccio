# node-tar.gz main class
#
# @version 0.0.1
# @author Alan Hoffmeister <alan@cranic.com.br>
# @date 2012-12-06 10:22 AM GTM - 3:00

fstream = require 'fstream'
tar = require 'tar'
zlib = require 'zlib'
fs = require 'fs'

class TarGz

    # The construcor, you can change the compresion levels
    #
    # @public
    # @param level Integer The compression level from 0-9. Default 6.
    # @param memLevel Integer The memory allocation level from 1-9. Default 6.
    # @return Object the main class methods.
    constructor : (@level = 6, @memLevel = 6, @proprietary = true) ->
        @

    # The compress method
    #
    # @public
    # @param source String The path from a folder to be compressed
    # @param destination String The path for the file to be extracted. Its
    # a good idea to end with .tar.gz
    # @param callback Function A function that will be called when the compression
    # ended and will have the error object
    # @return Object the main class methods.
    compress : (source, destination, callback) ->
        self = @

        fs.stat source, (err, stat) ->
            type = 'Directory' #if stat.isDirectory()
            #type = 'File' if stat.isFile()
            # Single file support need to be implemented.

            process.nextTick ->
                gzip = zlib.createGzip
                    level : self.level
                    memLevel : self.memLevel

                #if type == 'File'
                #    reader = fs.createReadStream(source)

                if type == 'Directory'
                    reader =  fstream.Reader
                        path : source
                        type : type

                props = noProprietary : false if self.proprietary == true
                props = noProprietary : true if self.proprietary == false

                reader.pipe(tar.Pack(props)).pipe(gzip).pipe fstream.Writer(destination).on 'close', ->
                    callback null if typeof callback == 'function'
        @

    # The extraction method
    #
    # @public
    # @param source String The path from an .tar.gz to be extracted
    # @param destination String The path from a folder where the itens will be extracted
    # @param callback Function A function that will be called when the extraction
    # ended and will have the error object
    # @return Object the main class methods.
    extract : (source, destination, callback) ->
        self = @

        process.nextTick ->
            fstream.Reader(
                path : source
                type : 'File'
            ).pipe(zlib.createGunzip()).pipe(tar.Extract({path: destination})).on 'end', ->
                callback null if typeof callback == 'function'  

        @

module.exports = TarGz