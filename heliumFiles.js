'use strict'

/**
 * This module makes dealing with our project files in Grunt and Karma very convenient. It allows you to
 * request an array of project files like so:
 *
 * files.indexHtml().apptributesScripts().vendorScripts().fonts().views().bring()
 *
 * Always call the bring() function at the end. The bring function takes a string which it can prefix to the
 * returned paths.
 */

/**
 * The object which will be exported by this module
 */
var files = {}

/**
 * Array to host the files which will be returned by chaining
 */
var arrOfFiles = []

files.indexHtml = function() {
  arrOfFiles.push('index.html')
  return files
}

files.app = function() {
  arrOfFiles.push('js/app.js')
  return files
}

files.config = function() {
  arrOfFiles.push('config.js')
  return files
}

files.services = function() {
  arrOfFiles.push('js/services/**/*.js')
  return files
}

files.directives = function() {
  arrOfFiles.push('js/directives/**/*.js')
  return files
}

files.controllers = function() {
  arrOfFiles.push('js/controllers/**/*.js')
  return files
}

files.filters = function() {
  arrOfFiles.push('js/filters/**/*.js')
  return files
}

files.templatesJs = function() {
  arrOfFiles.push('js/templates.js')
  return files
}

files.heliumScripts = function() {
  files.templatesJs()
  files.directives()

  files.app()
  files.services()
  files.controllers()
  files.filters()

  return files
}

/**
 * Vendor scripts
 */
files.vendorScripts = function() {
  arrOfFiles.push(
    'vendor/angular-manual-bootstrap.js',
    'vendor/gapi.js',
    'vendor/bower_components/jquery/dist/jquery.min.js',
    'vendor/bower_components/lodash/dist/lodash.min.js',
    'vendor/bower_components/aws-sdk/dist/aws-sdk.min.js',
    'vendor/bower_components/showdown/compressed/showdown.js',
    'vendor/bower_components/angular/angular.min.js',
    'vendor/bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'vendor/bower_components/angular-sanitize/angular-sanitize.min.js',
    'vendor/bower_components/angular-markdown-directive/markdown.js'
  )

  return files
}

/**
 * Vendor + Apptribute scripts
 */
files.allScripts = function() {
  files.vendorScripts()
  files.heliumScripts()

  return files
}


files.apptributesStyles = function() {
  arrOfFiles.push(
    'css/**/*.css'
  )

  return files
}

files.vendorStyles = function() {
  arrOfFiles.push(
    'vendor/bower_components/bootstrap/dist/css/bootstrap.min.css'
  )

  return files
}

files.allStyles = function() {
  files.vendorStyles()
  files.apptributesStyles()

  return files
}

files.views = function() {
  arrOfFiles.push(
    'html/**/*.html'
  )

  return files
}

files.testFiles = function() {
  arrOfFiles.push(
    'specs/**/*.js'
  )

  return files
}

files.vendorTestFiles = function() {
  arrOfFiles.push(
    'vendor/bower_components/angular-mocks/angular-mocks.js'
  )

  return files
}

files.fonts = function() {
  arrOfFiles.push(
    'fonts/**/*'
  )

  return files
}

files.images = function() {
  arrOfFiles.push(
    'images/**/*'
  )

  return files
}

files.revisionedCompiledScripts = function() {
  arrOfFiles.push(
    '*.app.js'
  )

  return files
}

files.revisionedCompiledStyles = function() {
  arrOfFiles.push(
    '*.style.css'
  )

  return files
}

files.compiledScripts = function() {
  arrOfFiles.push(
    'app.js'
  )

  return files
}

files.compiledStyles = function() {
  arrOfFiles.push(
    'style.css'
  )

  return files
}

/**
 * To get the final array, call the bring function at the end. This function takes a prefix string which it
 * will prefix to the file paths in the returned array.
 */
files.bring = function(prefix) {
  // Empty arrOfFiles into a temp array
  var tempArr = arrOfFiles.splice(0, arrOfFiles.length)

  // Map the file paths based on given prefix and return the array
  return tempArr.map(function(filePath) {
    prefix = prefix || ''
    return prefix + filePath
  })
}

module.exports = files