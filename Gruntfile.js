module.exports = function(grunt) {
  var files = require('./heliumFiles.js')

  require('load-grunt-tasks')(grunt)

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: {
        files: [
          {
            dot: true,
            src: [
              'build/*',
              '.tmp/*'
            ]
          }
        ]
      },
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['uglify'])
}
