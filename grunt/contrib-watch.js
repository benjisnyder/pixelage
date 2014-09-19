module.exports = function(grunt) {
	grunt.config('watch', {
		css : {
			files: ['<%= vars.source %>/css/main.scss','<%= vars.source %>/css/vars.scss'],
			tasks: ['sass'],
			options: {
				spawn: false
			}
		},
		scripts : {
			files: ['<%= vars.source %>/js/*.js'],
			tasks: ['concat'],
			options: {
				spawn: false,
			},
		},
		html : {
			files: ['<%= vars.source %>/partials/*.html'],
			tasks: ['copy:partials'],
			options: {
				spawn: false,
			},
		},
		index : {
			files: ['<%= vars.source %>/index.html'],
			tasks: ['preprocess'],
			options: {
				spawn: false,
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};