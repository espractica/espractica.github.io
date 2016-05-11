var gulp = require('gulp');
var hb = require('gulp-hb');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var csslint = require('gulp-csslint');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var svgmin = require('gulp-svgmin');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var htmlmin = require('gulp-htmlmin');
var w3cjs = require('gulp-w3cjs');
var frontMatter = require('gulp-front-matter');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var ghPages = require('gulp-gh-pages')

function plumberit(errTitle) {
return plumber({
errorHandler: notify.onError({
    title: errTitle || "Error running Gulp",
    message: "Error: <%= error.message %>",
    })
});
}
/*///////////////////////////////////////
Browser Sync Implementation
///////////////////////////////////////*/
gulp.task('browser-sync', function() {
    browserSync.init({
        tunnel:'mycutelanding',
        server: {
            baseDir: "./dist"
        }
    });
});
/*///////////////////////////////////////
build and deploy
///////////////////////////////////////*/
gulp.task('build', function () {
    return gulp
        .src('./src/views/pages/*.html')
        .pipe(plumberit('Build Error'))
        .pipe(frontMatter({property: 'data.front' }))
        .pipe(hb({partials: './src/views/partials/*.hbs',data: './src/views/data.json',debug:1}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({'branch':'master'}));
}); 
/*///////////////////////////////////////
linters
///////////////////////////////////////*/
gulp.task('jslint', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('csslint', function() {
  gulp.src(['./src/css/style.css'])
    .pipe(csslint())
    .pipe(csslint.reporter('compact'));
});
gulp.task('htmllint', function() {
  gulp.src(['./dist/*.html'])
    .pipe(plumberit("HTML Validation errors"))
    .pipe(w3cjs()) 
    //.pipe(w3cjs.reporter());
});
/*///////////////////////////////////////
JS watcher 
///////////////////////////////////////*/
gulp.task('js',  function () {
  return gulp.src(['./src/libraries/*.js','./src/js/*.js'])
    .pipe(sourcemaps.init())
        .pipe(plumberit("JS uglify errors"))
        .pipe(concat('min.js'))
        .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({ stream: true }));
});
/*///////////////////////////////////////
CSS watcher 
///////////////////////////////////////*/
gulp.task('css', function () { 
  return gulp.src(['./src/css/materialize.css','./src/css/*.css'])
        .pipe(sourcemaps.init())
            .pipe(plumberit('CSS parsing error'))
            .pipe(csso())
            .pipe(concat('min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({ stream: true }));
});
/*///////////////////////////////////////
img minifier 
///////////////////////////////////////*/
gulp.task('svg', function () {
    return gulp.src('./src/img/**/*.svg')
        .pipe(plumberit('Svg minification error'))
        .pipe(svgmin())
        .pipe(gulp.dest('./dist/img'))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('img', function(){
	return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif)')
    .pipe(plumberit('Img minification error'))
	.pipe(cache(imagemin({interlaced: true})))// Caching images that ran through imagemin
	.pipe(gulp.dest('dist/img'))
    .pipe(browserSync.reload({ stream: true }));
});
/*///////////////////////////////////////
copy fonts
///////////////////////////////////////*/
gulp.task('font', function () {
    return gulp.src('./src/font/**/*')
        .pipe(gulp.dest('./dist/font'))
        .pipe(browserSync.reload({ stream: true }));
});
/*///////////////////////////////////////
RELOAD YOUR BROWSER
///////////////////////////////////////*/
gulp.task('bs-reload', function () {
	browserSync.reload();
});

/*///////////////////////////////////////
WATCHER
///////////////////////////////////////*/
gulp.task('default', ['browser-sync','js','css','build','svg','img'], function () {
	gulp.watch(['./src/js/*.js'],   ['js','jslint']);
	gulp.watch('./src/**/*.css',  ['css','csslint']);
	gulp.watch('./dist/**/*.html', ['htmllint']);
	gulp.watch(['./src/views/**/*'], ['build']);
	gulp.watch('./src/**/*.svg', ['svg']);
	gulp.watch('src/**/*.+(png|jpg|jpeg|gif)', ['img']);
});