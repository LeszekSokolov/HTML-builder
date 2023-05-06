const fs = require("fs");
const path = require("path");

fs.readdir(
  path.join(__dirname, "secret-folder"),
  { withFileTypes: true },
  function (err, files) {
    if (err) {
      return console.log(err);
    } else {
      files.forEach((file) => {
        fileInfo(file);
      });
    }
  }
);

let fileInfo = function (file) {
  let data = [];
  if (file.isFile()) {
    fs.stat(
      path.resolve(__dirname, "secret-folder", file.name),
      function (err, stats) {
        if (err) {
          return console.log(err);
        }
        data.push(file.name.split(".").slice(0, -1).join("."));
        data.push(path.extname(file.name).slice(1));
        data.push(Math.round(stats.size / 1024) + "kb");
        console.log(data.join(" - "));
      }
    );
  }
};
