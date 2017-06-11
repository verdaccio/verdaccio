module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'lib/static/main.js': ['lib/ui/js/main.js'],
        },
        options: {
          debug: true,
          transform: ['browserify-handlebars'],
        },
      },
    },
    less: {
      dist: {
        files: {
          'lib/static/main.css': ['lib/ui/css/main.less'],
        },
        options: {
          sourceMap: false,
        },
      },
    },
    watch: {
      files: ['lib/ui/**/*'],
      tasks: ['default'],
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', [
    'browserify',
    'less',
  ]);
};
