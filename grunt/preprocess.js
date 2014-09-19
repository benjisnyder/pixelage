module.exports = function(grunt) {
	grunt.config('preprocess', {
		release : {
			src: '<%= vars.source %>/index.html',
			dest: '<%= vars.release %>/index.html'
		}
	});

	grunt.loadNpmTasks('grunt-preprocess');
};