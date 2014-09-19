module.exports = function(grunt) {
	grunt.config('mkdir', {
		release : {
			options: {
				create: ['<%= vars.release %>', '<%= vars.release %>/css', '<%= vars.release %>/js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-mkdir');
};