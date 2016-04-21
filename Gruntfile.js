module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'lib/static/main.js': [ 'lib/GUI/js/main.js' ]
        },
        options: {
          debug: true,
          transform: [ 'browserify-handlebars' ]
        }
      }
    },
    less: {
      dist: {
        files: {
          'lib/static/main.css': [ 'lib/GUI/css/main.less' ]
        },
        options: {
          sourceMap: false
        }
      }
    },
    watch: {
      files: [ 'lib/GUI/**/*' ],
      tasks: [ 'default' ]
    }
  })

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-less')

  grunt.registerTask('default', [
    'browserify',
    'less'
  ])
}
