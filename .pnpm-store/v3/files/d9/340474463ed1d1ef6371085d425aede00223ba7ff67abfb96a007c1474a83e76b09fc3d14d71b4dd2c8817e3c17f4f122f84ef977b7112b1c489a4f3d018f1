Unix crypt(3) Javascript Implementation
=======================================

Straightforward implementaiton of the DES-based Unix crypt(3) hash, based largely on crypt.c in the Seventh Edition Unix distribution released by Caldera Systems under a BSD-style license.

Building the minified version
-----------------------------

Running the Makefile requires the [Google Closure Compiler](http://code.google.com/closure/compiler/)
installed on your path. Alternatively, you may use any JS Minifier you want.

Usage
-----

Simple examples:

    unixCryptTD('foob' /* pw */, 'ar' /* salt */) // === 'arlEKn0OzVJn.'
    unixCryptTD([102, 111, 111, 98], 'ar') // === 'arlEKn0OzVJn.'
    unixCryptTD([102, 111, 111, 98], [97, 114] // === 'arlEKn0OzVJn.'
    unixCryptTD('foob', 'ar', true /* returnBytes */) // === [97, 114, 108, 69,
                                     // 75, 110, 48, 79, 122, 86, 74, 110, 46]

Testing
-------

Just run `npm test`

Author
------

Tim Joseph Dumol <[tim@timdumol.com](mailto:tim@timdumol.com)>

Licensing
---------

BSD License:

Copyright(C) Tim Joseph F. Dumol 2011. All rights reserved.
Derived from crypt.c in the Seventh Edition Unix distribution by Caldera International, which is Copyright(C) Caldera International Inc. 2001-2002. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code and documentation must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* All advertising materials mentioning features or use of this software must display the following acknowledgement: This product includes software developed or owned by Caldera International, Inc.

* Neither the name of Caldera International, Inc. nor the names of other contributors may be used to endorse or promote products derived from this software without specific prior written permission.

USE OF THE SOFTWARE PROVIDED FOR UNDER THIS LICENSE BY CALDERA INTERNATIONAL, INC. AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL CALDERA INTERNATIONAL, INC. BE LIABLE FOR ANY DIRECT, INDIRECT INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,e BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
