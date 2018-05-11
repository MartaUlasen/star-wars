'use strict';

const gulp = require('gulp'),
    gulpConfig = require('./gulp.config'),
    //del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    css = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    //webpack = require('webpack-stream'),
    webserver = require('gulp-webserver'),
    server = require('gulp-server-livereload');

const //CLEAN = 'clean',
    HTML = 'html',
    CSS = 'CSS',
    CSS_MIN = 'CSSmin',
	JS = 'JS',
    ASSETS = 'assets';
    //JS_DEV = 'jsDev',
    //JS_PROD = 'jsProd',
    //WEBPACK_DEV_CFG = './webpack/webpack.dev.config',
    //WEBPACK_PROD_CFG = './webpack/webpack.prod.config';

/* gulp.task(CLEAN, function () {
    del.sync([gulpConfig.dist.root + '/**']);
    console.log('output directory cleaned!');
}); */

gulp.task(HTML, function () {
    return gulp.src(gulpConfig.htmlEntry)
        .pipe(gulp.dest(gulpConfig.dist.root));
});

gulp.task(JS, function () {
    return gulp.src(gulpConfig.jsEntry)
        .pipe(gulp.dest(gulpConfig.dist.js));
});

gulp.task(CSS, function () {
    return gulp.src(gulpConfig.cssEntry)
        .pipe(sourcemaps.init())
        .pipe(css())
        .pipe(sourcemaps.write())
		.pipe(rename(gulpConfig.dist.css))
        .pipe(gulp.dest(gulpConfig.dist.root));
});

gulp.task(CSS_MIN, function () {
    return gulp.src(gulpConfig.cssEntry)
        .pipe(css())
        .pipe(autoprefixer())
        .pipe(minifycss())
		.pipe(rename(gulpConfig.dist.css))
        .pipe(gulp.dest(gulpConfig.dist.root));
});

gulp.task(ASSETS, function() {
    return gulp.src(gulpConfig.assetsEntry)
        .pipe(gulp.dest(gulpConfig.dist.assets));
});

/* gulp.task(JS_DEV, function() {
    return gulp.src(gulpConfig.jsEntry)
        .pipe(webpack(require(WEBPACK_DEV_CFG)))
        .pipe(gulp.dest(gulpConfig.dist.root));
});

gulp.task(JS_PROD, function () {
    return gulp.src(gulpConfig.jsEntry)
        .pipe(webpack(require(WEBPACK_PROD_CFG)))
        .pipe(gulp.dest(gulpConfig.dist.root));
}); */

gulp.task('compileDev', [HTML, CSS, JS, ASSETS]);

//gulp.task('compileProd', [HTML, CSS_MIN, JS_PROD, ASSETS]);

gulp.task('webserver', ['compileDev'], function() {
    gulp.src(gulpConfig.dist.root)
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            defaultFile: 'index.html',
            open: true,
            port: 3000,
            fallback: 'index.html'
        }));
});

gulp.task('default', ['webserver'], function (err) {
    console.log('all tasks done!');
    //gulp.watch(['config.js', gulpConfig.js, gulpConfig.jsx], [JS_DEV]);
    gulp.watch(gulpConfig.htmlEntry, [HTML]);
    gulp.watch(gulpConfig.css, [CSS]);
    gulp.watch(gulpConfig.js, [JS]);
    console.log('watchers launched!');
});

/* gulp.task('prod', ['compileProd'], function (err) {
    console.log('production version done!');
}); */
