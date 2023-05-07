const fs = require("fs");
const path = require("path");
let pathStyles = path.join(__dirname, "styles");
let pathBundle = path.join(__dirname, "project-dist", "bundle.css");

fs.readdir(pathStyles, { withFileTypes: true }, function (err, items) {
  if (err) {
    throw err;
  }
  let out = fs.createWriteStream(pathBundle);
  items.forEach(function (item) {
    let extension = path.parse(item.name).ext;
    if (item.isFile() === true && extension == ".css") {
      let source = fs.createReadStream(
        path.join(pathStyles, item.name),
        "utf-8"
      );
      source.on("data", (data) => out.write(data));
      source.on("error", (error) => console.log("Error", error.message));
    }
  });
});
