/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var  txt2chordpro = require('./gulp-txt2chordpro');



/**
 *  Define all the paths in a central place
 */
var paths = {
    sheets: {
        chordPro: ['src/chordpro/*'],
        txt: ['src/txt/*']
    },
    dest: {
        build: 'build'
    }
};


gulp.task('clean', function (cb) {
    return del([paths.dest.build], cb);
});


gulp.task('meta-modify', ['clean'], function () {
    return gulp.src(paths.sheets.chordPro)
        .pipe(replace(/\*0\* Imported song from file: (.*).txt/g, '$1'))
        .pipe(replace(/(.*)Key:(.*?)\[(.*)\]/g, '{copyright:$1[$3]}\n{key:$2}'))
        .pipe(replace(/\{copyright:(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?(\[(.*?)])?}/g, '{copyright:$2 $4 $6 $8 $10 $12 $14 $16 $18 $20 $22 $24 $26 $28}'))
        .pipe(replace(/}\n.*\n\{copyright:/gm, '}\n{copyright:'))
        .pipe(replace(/Tempo:(.*)/g, '{tempo:$1}'))
        .pipe(replace(/Time:(.*)/g, '{time:$1}'))
        .pipe(replace(/(\{key:(.*?)}\n\{tempo:(.*?)}\n\{time:(.*?)})/g, '{subtitle:key: $2 | tempo: $3 | time: $4}\n$1'))
        .pipe(replace(/(.+:)\n/g, '{comment_italic:$1}\n'))
        .pipe(rename(function (path) {
            path.basename = path.basename.split('.')[0];
            path.extname = '.chordpro';//".txt";//
        }))
        .pipe(gulp.dest(paths.dest.build));
});

gulp.task('txt-meta-modify', ['clean'], function () {
    return gulp.src(paths.sheets.txt)
        .pipe(replace(/^(.*)\n/g, '{title:$1}\n'))
        .pipe(replace(/}\n(.*)\n/g, '\n{copyright:$1}\n'))
        .pipe(replace(/^Key:(.*?)$/mg, '{key:$1}'))
        .pipe(replace(/Tempo:(.*)/g, '{tempo:$1}'))
        .pipe(replace(/Time:(.*)/g, '{time:$1}'))
        .pipe(replace(/(\{key:(.*?)}\n\{tempo:(.*?)}\n\{time:(.*?)})/g, '{subtitle:key: $2 | tempo: $3 | time: $4}\n$1'))
        .pipe(replace(/(.+:)\n/g, '{comment_italic:$1}\n'))
        .pipe(rename(function (path) {
            path.basename = path.basename.split('.')[0];
            path.extname = '.chordpro';//".txt";//
        }))
        .pipe(gulp.dest(paths.dest.build));
});

gulp.task('convert', ['clean'], function () {
    return gulp.src(paths.sheets.txt)
        .pipe(txt2chordpro())
        .pipe(replace(/^(.*)\n/g, '{title:$1}\n'))
        .pipe(replace(/}\n(.*)\n/g, '}\n{copyright:$1}\n'))
        .pipe(replace(/^Key:(.*?)$/mg, '{key:$1}'))
        .pipe(replace(/^Tempo:(.*)$/mg, '{tempo:$1}'))
        .pipe(replace(/^Time:(.*)$/mg, '{time:$1}'))
        .pipe(replace(/(\{key:(.*?)}\n\{tempo:(.*?)}\n\{time:(.*?)})/g, '{subtitle:key: $2 | tempo: $3 | time: $4}\n$1'))
        .pipe(replace(/(.+:)\n/g, '{comment_italic:$1}\n'))
        .pipe(rename(function (path) {
            path.extname = '.chordpro';//".txt";//
        }))
        .pipe(gulp.dest(paths.dest.build));
});

/**
 * Creates a full build.
 */
gulp.task('build', ['meta-modify']);

/**
 * DEFAULT TASK: (this task is executed if gulp is called without any argument.)
 */
gulp.task('default', ['build']);