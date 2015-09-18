/*
 * Disclaimer: this is my nodejs hello world.
 * Nothing here should be considered as an example of how things should be done!
 */
var gulp         = require('gulp'),
    del          = require('del'),
    runSequence  = require('run-sequence'),
    childProcess = require('child_process'),
    ghPages      = require('gulp-gh-pages'),
    bower        = require('gulp-bower'),
    rename       = require('gulp-rename'),
    gutil        = require('gulp-util'),
    sass         = require('gulp-sass'),
    merge        = require('merge-stream');

var requiredBranch = 'sculpin';
var deployBranch = 'master';

gulp.task('default', function(cb) {
    runSequence(['install', 'clean'], ['build:dev'], cb);
});

gulp.task('install', ['composer', 'bower']);

gulp.task('composer', function(cb) {
    childProcess.exec(
        'composer install --ansi',
        function(err, stdout, stderr) {
            if (err) {
                err = new gutil.PluginError('task:composer', err);
            }
            cb(err);
        }
    );
});

gulp.task('bower', function() {
    return bower();
});

gulp.task('build', function(cb) {
    runSequence('clean', ['sass', 'js'], 'sculpin', cb);
});

gulp.task('build:dev', function(cb) {
    runSequence('clean', ['sass', 'js'], 'sculpin:dev', cb);
});

gulp.task('sculpin', function(cb) {
    childProcess.exec(
        './vendor/bin/sculpin generate --env=prod',
        function(err, stdout, stderr) {
            if (err) {
                err = new gutil.PluginError('task:build:sculpin', err);
            }
            cb(err);
        }
    );
});

gulp.task('sass', function() {
    return gulp.src('assets/scss/**/*.scss')
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [
                'assets/bower_components',
            ]
        }))
        .pipe(gulp.dest('source/css'));
});

gulp.task('js', function() {
    var bower = gulp.src(
            [
                'assets/bower_components/jquery/dist/jquery.js',
                'assets/bower_components/bootstrap/dist/js/bootstrap.js',
            ],
            {base: 'assets/bower_components'}
        )
        .pipe(rename(function(path) {
            path.dirname = path.dirname.split('/')[0];
        }));

    var assets =  gulp.src(['assets/js/**/*.js']);

    return merge(bower, assets)
        .pipe(gulp.dest('source/js'));
});

gulp.task('sculpin:dev', function(cb) {
    childProcess.exec(
        './vendor/bin/sculpin generate --env=dev',
        function(err, stdout, stderr) {
            if (err) {
                err = new gutil.PluginError('task:build:sculpin:dev', err);
            }
            cb(err);
        }
    );
});

gulp.task('watch', ['watch:sass', 'watch:sculpin']);

gulp.task('watch:sculpin', function(cb) {
    var sculpin = childProcess.spawn(
        './vendor/bin/sculpin',
        ['generate', '--server', '--watch', '--port=8888'],
        {stdio: ['ignore', process.stdout, process.stderr]}
    );

    // just for fun
    var interrupt = function() {
        console.log("\nStopping sculpin server");
        sculpin.kill('SIGINT');
    }
    // i wonder if this actually overrides legit listeners
    process.once('SIGINT', interrupt);
    sculpin.on('exit', function(code, signal) {
        // i should probably check and detach interrupt listener here
        cb(code === 0 || signal === 'SIGINT' ? null : 'Sculpin exited with code: ' + code);
    })

});

gulp.task('watch:sass', function() {
    return gulp.watch('assets/scss/**/*.scss', ['sass']);
});

gulp.task('deploy', ['deploy:guard', 'build'], function(cb) {
    return gulp.src(['output_prod/**/*.*', 'assets/gh-pages/**'], {dot: true})
        .pipe(ghPages({
                branch: deployBranch,
                message: 'Deploying sculpin-generated pages'
    }));
});

gulp.task('deploy:guard', function(cb) {
    childProcess.exec(
        'git symbolic-ref -q HEAD 2>/dev/null',
        [],
        function(err, stdout, stderr) {
            if (!err && stdout.trim() !== 'refs/heads/' + requiredBranch) {
                err = new gutil.PluginError(
                    'task:deploy:branch_guard',
                    'Deployment is only allowed from branch "' + requiredBranch + '"'
                );
            }
            if (err) {
                return cb(err);
            }
            childProcess.exec(
                'git status --porcelain | wc -l',
                [],
                function(err, stdout, stderr) {
                    if (!err && stdout.trim() !== '0') {
                        err = new gutil.PluginError(
                            'task:deploy:uncommitted_guard',
                            'Deployment is only allowed from clean state'
                        );
                    }
                    cb(err);
                }
            );
        }
    );
});

gulp.task('clean:all', function() {
    return del([
        './.publish/',
        './source/css/',
        './source/js/',
        './output_dev/',
        './output_prod/',
    ]);
});

gulp.task('clean', function() {
    return del([
        './.publish/',
        './source/css/',
        './source/js/',
        './output_prod/',
    ]);
});
