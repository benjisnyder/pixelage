module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        vars: {
			source: 'source',
			release: 'release',
			title: 'Dev'
        }
    });

    grunt.loadTasks('grunt');

    grunt.registerTask('default', ['mkdir', 'env:dev', 'preprocess', 'copy', 'sass:dev', 'concat']);
    // TODO: uglify all files on release
    grunt.registerTask('release', ['mkdir', 'env:release', 'preprocess', 'copy', 'sass:release', 'concat', 'uglify']);
	grunt.registerTask('combine', ['concat']);
    grunt.registerTask('min', ['uglify']);
};