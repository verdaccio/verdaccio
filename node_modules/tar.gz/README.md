# **node-tar.gz**
Native gzip compression and decompression utility for Node.js.

### **Installation**

For simple installation:

    npm install tar.gz

If you want to use the `targz` command line:

    npm intall -g tar.gz

### **Usage**

At the moment this package can only compress a folder and everything that
is inside it. To compress something is easy:

    var targz = require('tar.gz');
    var compress = new targz().compress('/path/to/compress', '/path/to/store.tar.gz', function(err){
        if(err)
            console.log(err);

        console.log('The compression has ended!');
    });

With the same easy you can extract a gziped file:

    var targz = require('tar.gz');
    var compress = new targz().extract('/path/to/stored.tar.gz', '/path/to/extract', function(err){
        if(err)
            console.log(err);

        console.log('The extraction has ended!');
    });

You can pass some configuration parameters to the constructor before compress:

    var targz = require('tar.gz');

    var level = 6 //the compression level from 0-9, default: 6
    var memLevel = 6 //the memory allocation level from 1-9, default: 6
    var proprietary = true //to include or not proprietary headers, default: true

    var compress = new targz(level, memLevel, proprietary).compress(...)

### **Command line**

    $ targz -h

      Usage: targz [options]

      Options:

        -h, --help           output usage information
        -V, --version        output the version number
        -c, --compress       Compress folder to archive
        -x, --extract        Extract archive to folder
        -l, --level [n]      Compression level from 0-9. Default 6.
        -m, --memory [n]     Memory allocation level from 1-9. Default 6.
        -n, --noproprietary  Remove proprietary headers.

      Examples:

        Default compression
        $ targz -c /folder/to/compres /path/to/archive.tar.gz

        Extracting some archive
        $ targz -x /path/to/archive.tar.gz /destination/folder

        Maximum compression
        $ targz -l 9 -m 9 -c /folder/to/compres /path/to/archive.tar.gz


### **TODO**

 * Vows.js tests
 * Single file compression
 * Add more todos...


### **License (MIT)**

Copyright (C) 2012 Cranic Tecnologia e Informática LTDA

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files 
(the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, 
publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.