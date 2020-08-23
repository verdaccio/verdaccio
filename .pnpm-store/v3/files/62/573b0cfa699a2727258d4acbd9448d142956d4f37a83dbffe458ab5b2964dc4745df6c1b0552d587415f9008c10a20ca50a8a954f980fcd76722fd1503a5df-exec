/**
 * To debug gruntfile:
 * node-debug $(which grunt) task
 */  

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      run: {
        options: {
          ui : 'bdd',
          reporter: 'spec',
        },
        //We require all our tests in the conf file, so we
        //can do some pre-test functions before they are run.
        src: ['./test/test.js']
      },
      save: {
        options: {
          ui : 'bdd',
          require: [
            function(){ global.save = true; } //pass save as true when generating/saving test output
          ],
          reporter: 'spec'
        },
        src: ['./test/test.js']
      },
      display: {
        options: {
          ui : 'bdd',
          require: [
            function(){ global.display = true; } 
          ],
          reporter: 'spec'
        },
        src: ['./test/test.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test-run', [
    'mochaTest:run'
  ]);

  grunt.registerTask('test-save', [
    'mochaTest:save'
  ]);

  grunt.registerTask('test-display', [
    'mochaTest:display'
  ]);

  //quick alias
  grunt.registerTask('t',[
    'mochaTest:run'
  ]);
};
