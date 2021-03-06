var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var multiply = require('gulp-tiled-multiply');

const modulesPath = './public/modules/*/*.js';
const mapsPath = ['./public/tilemaps/*.json', '!./public/tilemaps/*-tripled.json'];

gulp.task('scripts', function() {
  return gulp.src([
      './public/modules/classes/*.js',
      './public/modules/states/*.js',
      './public/modules/levels/*.js',
      './public/main.js'
    ])
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('tilemaps', function() {
  return gulp.src(mapsPath)
    .pipe(multiply(3))
    .pipe(rename(function (path) {
      path.basename += '-tripled';
    }))
    .pipe(gulp.dest('./public/tilemaps'))
});

gulp.task('default', ['scripts', 'tilemaps'], function() {
  console.log('project built');
});

gulp.task('watch', ['default'], function() {
  gulp.watch(modulesPath, ['scripts']);
  gulp.watch('./public/main.js', ['scripts']);
  gulp.watch(mapsPath, ['tilemaps']);
  console.log('watching files');
});
