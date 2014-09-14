module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            'dist/subview.js':      ['src/main.js'],
            'examples/build.js':    ['examples/example.js']
        },
        watch: {
            files: [ "src/*.js", "examples/example.js"],
            tasks: [ 'browserify' ]
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};

