/**
 * Created by WangAo on 2017/9/14.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');

gulp.task('minify', function () {
    return gulp.src('app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist'));
})

gulp.task('concat', function () {
    return gulp.src(['js/modules.js', 'js/controllers.js', 'js/directives.js', 'js/services.js'])
        .pipe(concat('main.js'))
        //.pipe(uglify({mangle: false}))
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('dist'));
})

gulp.task('watch', function () {
    gulp.watch('js/*', ['concat']);
    gulp.watch('app.js', ['concat']);
})

gulp.task('default', function() {
    console.log('test');
});
