var gulp = require('gulp');
var concat = require('gulp-concat');

var modulesPath = './public/modules/*/*.js';

gulp.task('scripts', function() {
  return gulp.src(modulesPath)
    .pipe(concat('modules.js'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', function() {
  gulp.run('scripts');

  gulp.watch(modulesPath, function(event) {
    gulp.run('scripts');
  })

  // gulp.watch('app/css/**', function(event) {
  //   gulp.run('styles');
  // })
  //
  // gulp.watch('app/**/*.html', function(event) {
  //   gulp.run('html');
  // })
})