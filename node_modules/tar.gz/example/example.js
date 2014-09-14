var gzip, targz;
targz = require('../index');
gzip = new targz();

gzip.compress(__dirname + '/../test/compress', __dirname + '/../test/compress.tar.gz', function(err) {
    console.log('Done compressing');
    return gzip.extract(__dirname + '/../test/compress.tar.gz', __dirname + '/../test/extract/', function(err) {
        return console.log('Done extracting.');
    });
});