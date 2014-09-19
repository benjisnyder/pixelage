module.exports = function(grunt) {
	grunt.config('sass', {
		dev : {
			files : {
				'<%= vars.release %>/css/main.css' : '<%= vars.source %>/css/main.scss'
			}
		},
		release : {
			options: {
				style: 'compressed'
			},
			files: {
				'<%= vars.release %>/css/main.css' : '<%= vars.source %>/css/main.scss'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
};