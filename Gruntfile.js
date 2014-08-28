module.exports = function(grunt) {
  var files = require('./heliumFiles.js')

  require('load-grunt-tasks')(grunt)

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
            src: files.allScripts().allStyles().views().indexHtml().bring(),
            dest: 'build/'
          }
        ]
      },

      build: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '.tmp',
            src: files.indexHtml().bring(),
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
          base: './.tmp',
          module: 'helium.templates',
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
          },

          css: {
            src: files.allStyles().bring(),
            cwd: 'build/'
          }
        }
      },

      build: {
        src: '.tmp/index.html',
        blocks: {
          js: {
            src: files.compiledVendorScripts().compiledScripts().config().bring(),
            cwd: '.tmp/'
          },

          css: {
            src: files.compiledStyles().bring(),
            cwd: '.tmp/'
          },
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
        files: files.all().bring('source/').concat([
          'Gruntfile.js',
          'heliumFiles.js',
          'server/server.js'
        ]),
        tasks: ['develop'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },

    cssmin: {
      build: {
        options: {
          keepSpecialComments: 0
        },
        files: {
          '.tmp/helium.css': files.allStyles().bring('.tmp/')
        }
      }
    },

    uglify: {
      heliumScriptsWithoutConfig: {
        options: {
          compress: {
            sequences: true, properties: true, dead_code: true, drop_debugger: true, unsafe: true,
            conditionals: true, comparisons: true, evaluate: true, booleans: true, loops: true, unused: true,
            if_return: true, join_vars: true, cascade: true, negate_iife: true
          },
          mangle: true
        },
        files: {
          '.tmp/helium.js': files.heliumScriptsWithoutConfig().bring('.tmp/'),
        },
      },

      vendorScripts: {
        options: {
          preserveComments: false,
          compress: {
            sequences: false, properties: false, dead_code: false, drop_debugger: false, unsafe: false,
            conditionals: false, comparisons: false, evaluate: false, booleans: false, loops: false, unused: false,
            hoist_funs: false, hoist_vars: false, if_return: false, join_vars: false, cascade: false,
            side_effects: false, warnings: false,
          },
          mangle: false
        },
        files: {
          '.tmp/vendor.js': files.vendorScripts().bring('.tmp/')
        }
      },
    },

    smoosher: {
      build: {
        files: {
          '.tmp/index.html': '.tmp/index.html'
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      build: {
        files: [
          {
            expand: true,
            src: files.heliumScripts().bring(),
            cwd: '.tmp',
            dest: '.tmp'
          }
        ]
      }
    },

    karma: {
      test: {
        configFile: 'tests/karma.conf.js',
        singleRun: true,
        browsers: ['Chrome'],
        coverageReporter: {
          type: 'lcov',
          dir: 'coverage/',
          subdir: function(browser) {
            return browser.toLowerCase().split(/[ /-]/)[0]
          }
        }
      }
    },

    open: {
      coverage: {
        path: 'tests/coverage/chrome/lcov-report/index.html'
      }
    }
  })

  grunt.registerTask('develop', [
    'clean:buildAndTmpFolders',
    'copy:allSourceToBuild',
    'fileblocks:dev',
    'express:dev',
    'watch:dev'
  ])

  grunt.registerTask('build', [
    'clean:buildAndTmpFolders',
    'copy:allSourceToTmp',
    'htmlmin:views',
    'html2js:views',
    'cssmin:build',
    'ngAnnotate:build',
    'uglify:heliumScriptsWithoutConfig',
    'uglify:vendorScripts',
    'fileblocks:build',
    'smoosher:build',
    'copy:build'
  ])

  grunt.registerTask('test', [
    'karma:test',
    'open:coverage'
  ])
}
