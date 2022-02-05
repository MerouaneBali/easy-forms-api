const gulp = require("gulp");
const jsdoc = require("gulp-jsdoc3");
const browserSync = require("browser-sync").create();
const jsdocConfig = require("./jsdoc.conf.json");

const genDocs = (cb) =>
  gulp.src(["README.md"], { read: false }).pipe(jsdoc(jsdocConfig, cb));

function watch() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "./docs",
    },
  });

  gulp.watch(["./**/*.js"]).on("change", genDocs);
}

exports.genDocs = genDocs;
exports.watch = watch;
