module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    'static/main.js': ['lib/GUI/js/main.js']
                },
                options: {
                    debug:     true
                }
            }
        },
        less: {
            dist: {
                files: {
                    'static/main.css': ['lib/GUI/css/main.less']
                },
                options: {
                    sourceMap: true
                }
            }
        },
        watch: {
            files: [ "lib/GUI/js/**/*", "lib/GUI/css/**/*"],
            tasks: [ 'default' ]
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', [
        'browserify',
        'less'
    ]);
};