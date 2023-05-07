const path = require("path");
const fs = require("fs/promises");
let directory = path.join(__dirname, "files");
let copy = path.join(__dirname, "files-copy");

fs.rm(copy, {
  recursive: true,
  force: true,
}).finally(function () {
  fs.mkdir(copy, { recursive: true });
  fs.readdir(directory, { withFileTypes: true }).then(function (data) {
    data.forEach(function (file) {
      if (file.isFile()) {
        let pathFile = path.join(directory, file.name);
        let pathFileCopy = path.join(copy, file.name);
        fs.copyFile(pathFile, pathFileCopy);
      }
    });
  });
});
