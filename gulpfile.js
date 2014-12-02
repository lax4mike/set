// Include gulp and plugins
var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    browserify  = require('gulp-browserify'),
    handlebars  = require('browserify-handlebars'),
    browserSync = require('browser-sync'),
    prefix      = require('gulp-autoprefixer'),
    stylus      = require('gulp-stylus');
  

var paths = {
    dest: "build/",
    css: {
        src: "app/styl/app.styl",
        watch: "app/**/*.styl"
    },
    js: {
        src: "app/js/index.js",
        watch: ['app/js/**/*.js', 'app/**/*.handlebars']
    },
    img: "app/img/**/*",
    html: ["app/**/*.htm", "app/**/*.html", "app/favicon.ico", "app/favicon-32x32.png"],
    assets: "build/public"
};


gulp.task('server', function(){
    return gulp.src("app/server/**/*")
        .pipe(gulp.dest(paths.dest));
});

// load our node server and set up browsersync
gulp.task('connect', ['server'], function(){
    
    // start server
    var server = require("./" + paths.dest + 'server.js'); 
    
    browserSync({
        proxy: "localhost:3200", // proxy to server (runs on port 3200)
        port: 8080,
        open: false, // or  "external"
        notify: false,
        ghostMode: false,
        files: [
            paths.dest + "/**"
        ]
    });
});

// watch html files and update server when they change
gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(plumber()) // handle errors
        .pipe(gulp.dest(paths.assets));
});


gulp.task('css', function() {
    return gulp.src(paths.css.src)
        .pipe(plumber()) // handle errors
        .pipe(stylus())
        .pipe(prefix(["last 1 version", "> 1%", "ie 8", "ie 7"], { cascade: true }))
        .pipe(gulp.dest(paths.assets + "/css/"));
});

gulp.task('js', function() {
    return gulp.src(paths.js.src)
        .pipe(plumber()) // handle errors
        .pipe(browserify({
            debug: true,
            transform: [handlebars]
        }))
        .pipe(gulp.dest(paths.assets + "/js/"));
});

// image
gulp.task('img', function() {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.assets + "/img/"));
});


gulp.task('package.json', function(){
    return gulp.src("package.json")
        .pipe(gulp.dest(paths.dest));
});



// Watch files for changes
gulp.task('watch', function() {
    gulp.watch(paths.css.watch, ['css']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.js.watch, ['js']);
});

// Default Task (run when you run 'gulp')
gulp.task('default', ['connect', 'html', 'package.json', 'css', 'js', 'img', 'watch']);


