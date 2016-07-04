// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var jshint      = require('gulp-jshint');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var minifyCss   = require('gulp-minify-css');
const imagemin  = require('gulp-imagemin');
const pngquant  = require('imagemin-pngquant');

//COPY FILES TO DIST
gulp.task('copyhtml', function() {
    gulp.src('./src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('copygif', function() {
    gulp.src('src/img/**/*.gif')
    .pipe(gulp.dest('dist/img'));
});


// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify CSS Plugins
gulp.task('minify-css-plugins', function() {
    return gulp.src('src/plugins/**/*.css')
        .pipe(concat('allcss.css'))
        .pipe(minifyCss({
            compatibility: 'ie8',
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('dist/plugins'));
});

// Otimize images
gulp.task('images', () => {
    return gulp.src('src/img/**/*.{jpg,png}')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});

// Concatenate & Minify JS Plugins
gulp.task('plugins', function() {
    return gulp.src('src/plugins/**/*.js')
        .pipe(concat('allplugins.js'))
        .pipe(gulp.dest('dist/plugins'))
        .pipe(rename('allplugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/plugins'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('serve', ['sass', 'scripts', 'plugins', 'copyhtml', 'minify-css-plugins'], function () {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['./dist/']
        }
    });

    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/plugins/*.js', ['plugins']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/*.html', ['copyhtml']);

    // watch for changes and reload
    gulp.watch([
        'dist/js/*.js',
        'dist/plugins/*.js',
        'dist/css/*.css',
        'dist/*.html',
    ]).on('change', reload);

});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
    gulp.watch('src/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'copyhtml', 'copygif', 'images']);