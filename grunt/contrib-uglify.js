module.exports = function(grunt) {
	grunt.config('uglify', {
		js : {
			files : {
				'<%= vars.release %>/js/main.js' : ['<%= vars.release %>/js/main.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};