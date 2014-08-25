module.exports = function(grunt) {
  var files = require('./heliumFiles.js')

  require('load-grunt-tasks')(grunt)

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      buildAndTmpFolders: {
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
    },

    copy: {
      allSourceToTmp: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'source',
            src: files.allScripts().allStyles().views().indexHtml().bring(),
            dest: '.tmp/'
          }
        ]
      },

      allSourceToBuild: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'source',
            src: files.all().bring(),
            dest: 'build/'
          }
        ]
      }
    },

    htmlmin: {
      // Minify all of our HTML files
      options: {
        removeComments: true,
        collapseWhitespace: true,
        keepClosingSlash: true
      },
      views: {
        files: [
          {
            expand: true,
            cwd: '.tmp',
            src: files.views().bring(),
            dest: '.tmp'
          }
        ]
      }
    },

    html2js: {
      views: {
        options: {
          base: '.tmp',
          module: 'helium.templates',
          useStrict: true,
        },
        src: files.views().bring('.tmp/'),
        dest: '.tmp/js/templates.js'
      }
    },

    fileblocks: {
      dev: {
        src: 'build/index.html',
        blocks: {
          js: {
            src: files.allScripts().bring(),
            cwd: 'build/'
          }
        }
      }
    },

    express: {
      dev: {
        options: {
          script: 'server/server.js',
        }
      }
    },

    watch: {
      dev: {
        files: files.all().bring('source/').concat(['heliumFiles.js', 'server/server.js']),
        tasks: ['develop'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },

//    cssmin: {
//      apptributes: {
//        options: {
//          keepSpecialComments: 0
//        },
//        src: files.apptributesStyles().bring('.tmp/'),
//        dest: 'build/static/style.css'
//      },
//      vendor: {
//        options: {
//          keepSpecialComments: 0
//        },
//        src: files.vendorStyles().bring('.tmp/'),
//        dest: 'build/static/vendorStyle.css'
//      }
//    }
  })

  grunt.registerTask('develop', [
    'clean:buildAndTmpFolders',
    'copy:allSourceToBuild',
    'fileblocks:dev',
    'express:dev',
    'watch:dev'
  ])
}
