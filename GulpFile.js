/**
 * Created by prandutt on 7/28/2014.
 */
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var path = require('path');
var uglify = require('gulp-uglify');
var typescript = require('gulp-tsc');
var rename = require('gulp-rename');
var foreach = require('gulp-foreach');

//Prod ready


gulp.task('usemin',['tsc'], function(){
    gulp.src('dist/logger.js') // path to your files
        .pipe(uglify())
        .pipe(gulp.dest('dist/logger.min'));


});

//End Prod ready




//type script compiler


gulp.task('tsc', function(){
    return gulp.src('src/logger.ts')
        .pipe(typescript({
            tmpDir: '.tmp',
            sourcemap: true,
            out: 'logger.js',
            outDir: './dist/'
        }).on('error', function(a){
            // Dont break the watch if compiler errors just emit to console.
        }))
        .pipe(gulp.dest('./dist/'));
});




//End Type script compiler

//watcher

gulp.task('default',function(){
    return gulp.watch('src/*.ts',['tsc']);
});
//end watcher