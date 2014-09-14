module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    'dist/onClick.js':      ['src/onClick.js'],
                    'examples/build.js':    ['examples/example.js']
                },
                options: {
                    standalone: 'onClick'
                }
            },
            test: {
                files: {
                    'test/build.js':        ['test/test.js']
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/onClick.min.js': ['dist/onClick.js']
                },
                options: {
                    sourceMap: true
                }
            }
        },
        watch: {
            files: [ "src/*.js", "examples/example.js", "test/test.js"],
            tasks: [ 'browserify:dist' ]
        },
        qunit: {
            files: ['test/index.html']
        },
        jshint: {
            dist: {
                src: ['src/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', [
        'browserify:test',
        'qunit',
        'jshint'
    ]);

    grunt.registerTask('build', [
        'test',
        'browserify:dist',
        'uglify'
    ]);
};
