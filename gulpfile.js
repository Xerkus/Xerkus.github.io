/*
 * Disclaimer: this is my nodejs hello world.
 * Nothing here should be considered as an example of how things should be done!
 */
var gulp         = require('gulp'),
    del          = require('del'),
    runSequence  = require('run-sequence'),
    childProcess = require('child_process'),
    ghPages      = require('gulp-gh-pages'),
    gutil        = require('gulp-util'),
    shell        = require('gulp-shell');

var requiredBranch = 'sculpin';
var deployBranch = 'master';

gulp.task('default', function(cb) {
    runSequence(['install', 'clean'], ['build:dev'], cb);
});

gulp.task('install', ['composer', 'bower']);

gulp.task('composer', shell.task('composer install --ansi',{quiet: true}));

gulp.task('bower', shell.task('bower install', {quiet: true}));

gulp.task('build', function(cb) {
    runSequence('clean', 'build:sculpin', cb);
});

gulp.task('build:dev', function(cb) {
    runSequence('clean', 'build:sculpin:dev', cb);
});

gulp.task('build:sculpin', function(cb) {
    childProcess.exec(
        './vendor/bin/sculpin generate --env=prod',
        function(err, stdout, stderr) {
            if (err) {
                console.log(stdout);
                console.log(stderr);
            }
            cb(err);
        }
    );
});

gulp.task('build:sculpin:dev', function(cb) {
    childProcess.exec(
        './vendor/bin/sculpin generate --env=dev',
        function(err, stdout, stderr) {
            if (err) {
                console.log(stdout);
                console.log(stderr);
            }
            cb(err);
        }
    );
});

gulp.task('watch', ['watch:sculpin']);

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
        //event.stopPropagation();
    }
    // i wonder if this actually overrides legit listeners
    process.once('SIGINT', interrupt);
    sculpin.on('exit', function(code, signal) {
        // i should probably check and detach interrupt listener here
        cb(code === 0 || signal === 'SIGINT' ? null : 'Sculpin exited with code: ' + code);
    })

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

gulp.task('clean', function() {
    return del([
        './.publish/',
        './source/css/',
        './source/js/',
        './output_dev/',
        './output_prod/',
    ]);
});

