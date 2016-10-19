var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    csscomb      = require('gulp-csscomb'),
    csso         = require('gulp-csso'),
    header       = require('gulp-header'),
    inject       = require('gulp-inject'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-ruby-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;

var pkg = require('./package.json');
var banner = ['/**',
              ' * Moving Pixel Perfect Typo v<%= pkg.version %> - <%= pkg.description %>',
              ' * @link <%= pkg.homepage %>',
              ' * @copyright 2015-<%= new Date().getFullYear() %> <%= pkg.author %>',
              ' * @license <%= pkg.license %>',
                ' */',
                ''].join('\n');

var helpers = [ 'build/js/PorterStemmer1980.js',
                'build/js/js-search.js',
                'build/js/progressive-image-loading.js',
                'build/js/script.js'
              ];

// js
gulp.task('js', function(){
    gulp.src(helpers)
        .pipe(plumber())
        .pipe(concat(pkg.name+'.js'))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

// sass
gulp.task('sass', function(){
    return sass('build/sass/'+pkg.name+'.sass', { sourcemap: true })
          .pipe(plumber())
          .pipe(sourcemaps.init())
          .pipe(autoprefixer({
            browsers: ['Android >= 2.1',
                       'Chrome >= 21',
                       'Edge >= 12',
                       'Explorer >= 7',
                       'Firefox >= 17',
                       'Opera >= 12.1',
                       'Safari >= 6.0'],
            cascade: false}))
          .pipe(csscomb())
          .pipe(rename({basename: pkg.name}))
          .pipe(header(banner, { pkg : pkg } ))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('dist/css'))
          .pipe(browserSync.stream())
          .pipe(csso())
      	  .pipe(rename({suffix: '.min'}))
          .pipe(header(banner, { pkg : pkg } ))
          .pipe(sourcemaps.write('.'))
      	  .pipe(gulp.dest('dist/css'))
          .pipe(browserSync.stream());
});

// gulp inject
gulp.task('inject', function(){
    var source = gulp.src(['dist/css/'+pkg.name+'.css', 'dist/js/'+pkg.name+'.js'], {read: false});
    gulp.src('index.html')
        .pipe(inject(source, {relative: true}))
        .pipe(gulp.dest('./'))
});

// serve
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "."
        },
        notify: false
    });
});

// Watch
gulp.task('watch', function(){
    gulp.watch('build/js/*.js', ['js']);
    gulp.watch('build/sass/**/*', ['sass']);
    gulp.watch("*.html").on("change", reload);
});

gulp.task('build', ['sass', 'js', 'inject']);
gulp.task('default', ['sass', 'js', 'inject', 'serve', 'watch']);
