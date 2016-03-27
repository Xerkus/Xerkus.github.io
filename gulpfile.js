/*
 * Disclaimer: this is my nodejs hello world.
 * Nothing here should be considered as an example of how things should be done!
 */
var gulp         = require('gulp'),
    del          = require('del'),
    runSequence  = require('run-sequence'),
    bower        = require('gulp-bower'),
    rename       = require('gulp-rename'),
    gutil        = require('gulp-util'),
    sass         = require('gulp-sass'),
    merge        = require('merge-stream');

var bowerComponentsPath = 'assets/bower_components';

// do not ignore SIGINT as PID 1 while running in docker
process.once('SIGINT', function() { process.exit(0); })

gulp.task('default');

gulp.task('bower', function() {
    return bower();
});

gulp.task('build', function(cb) {
    runSequence('clean', ['sass', 'js', 'assets'], cb);
});

gulp.task('build:dev', function(cb) {
    runSequence('clean', ['sass:dev', 'js', 'assets'], cb);
});

gulp.task('sass', function() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe(sass({
            includePaths: [
                bowerComponentsPath,
            ]
        }))
        .pipe(gulp.dest('source/assets/css'));
});

gulp.task('sass:dev', function() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe(sass({
            includePaths: [
                bowerComponentsPath,
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('source/assets/css'));
});

gulp.task('js', function() {
    return  gulp.src(['assets/js/**/*.js'])
        .pipe(gulp.dest('source/assets/js'));
});

// assets that don't need processing
gulp.task('assets', function() {
    var bower = gulp.src(
            [
                'assets/bower_components/bootstrap/dist/js/*.js',
                'assets/bower_components/font-awesome/fonts/*',
                'assets/bower_components/highlightjs/*.js',
                'assets/bower_components/jquery/dist/*.js',
            ],
            {base: bowerComponentsPath}
        )
        .pipe(gulp.dest('source/assets'));

    return bower;
});

gulp.task('watch', function(cb) {
    runSequence('build:dev', ['watch:sass'], cb);
});

gulp.task('watch:sass', function() {
    return gulp.watch('assets/scss/**/*.scss', ['sass:dev']);
});

gulp.task('clean', function() {
    return del([
        'source/assets/',
    ]);
});
