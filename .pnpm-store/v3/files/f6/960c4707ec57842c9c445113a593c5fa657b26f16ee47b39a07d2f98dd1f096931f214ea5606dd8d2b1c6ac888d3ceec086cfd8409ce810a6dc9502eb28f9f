'use strict';
module.exports = function(grunt){
	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
	grunt.initConfig({
		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},
			dist: {
				files: {
					'dist/main.js': 'src/main.js'
				}
			}
		}
	});

	grunt.registerTask('default', ['babel']);
};
