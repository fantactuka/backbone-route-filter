module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    qunit: {
      all: ['spec/backbone-qunit.html']
    },
    jasmine: {
      src: ['backbone-route-filter.js'],
      options: {
        specs: 'spec/**/*spec.js',
        vendor: ['backbone/test/vendor/jquery.js', 'backbone/test/vendor/underscore.js', 'backbone/backbone.js']
      }
    },
    uglify: {
      'backbone-route-filter-min.js': ['backbone-route-filter.js']
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'spec/**/*spec.js',
        'backbone-route-filter.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jshint', 'jasmine', 'qunit']);
  grunt.registerTask('default', ['test']);
};
