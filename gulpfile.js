/**
 * Created by vikashs on 25-01-2016.
 */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function () {
    gulp.src('public/stylesheets/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('public/stylesheets/'));
    console.log("gulp running");
});

gulp.task('default:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});
