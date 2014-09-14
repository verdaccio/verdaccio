targz = require '../index'
gzip = new targz()

# Compressing this folder
gzip.compress __dirname + '/../test/compress', __dirname + '/../test/compress.tar.gz', (err) ->
    console.log 'Done compressing'
    
    # Extracting a tar.gz file
    gzip.extract __dirname + '/../test/compress.tar.gz', __dirname + '/../test/extract/', (err) ->
        console.log 'Done extracting.'