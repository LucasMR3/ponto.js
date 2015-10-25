gulp   = require 'gulp'
coffee = require 'gulp-coffee'
uglify = require 'gulp-uglify'

gulp.task 'default', ['js','watch']

gulp.task 'js', ->
  gulp.src './src/**/*.coffee'
  .pipe coffee()
  .pipe uglify()
  .pipe gulp.dest './dist/'

gulp.task 'watch', ->
  gulp.watch './src/**/*.coffee' , ['js']

module.exports = gulp