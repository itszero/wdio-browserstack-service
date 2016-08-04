const gulp = require('gulp');
const buble = require('gulp-buble');

gulp.task('build-service', function () {
  return gulp.src('lib/browserstack-service.js')
      .pipe(buble())
      .pipe(gulp.dest('build'));
});

gulp.task('build-launch-service', function () {
  return gulp.src('lib/browserstack-launch-service.js')
      .pipe(buble())
      .pipe(gulp.dest('build'));
});

gulp.task('default', ['build-service', 'build-launch-service'], function() {});