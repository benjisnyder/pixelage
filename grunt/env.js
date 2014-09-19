module.exports = function(grunt) {
	grunt.config('env', {
		options: {
		},
		dev : {
			NODE_ENV: 'DEVELOPMENT'
		},
		release : {
			NODE_ENV: 'RELEASE'
		}
	});

	grunt.loadNpmTasks('grunt-env');
};