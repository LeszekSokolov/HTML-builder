const fs = require("fs");
const path = require("path");

let pathFirst = path.join(__dirname, "template.html");
let pathSecond = path.join(__dirname, "components");
let result = path.join(__dirname, "project-dist");
let template = fs.createReadStream(pathFirst, "utf8");

fs.readFile(pathFirst, function (error) {
  fs.mkdir(result, { recursive: true }, (err) => {
    if (err) throw err;
  });

  let writeTemplate = fs.createWriteStream(path.join(result, "index.html"), {
    withFileTypes: true,
  });
  let arrSrc = [];
  let arrTempl = [];
  let str;
  template.on("data", (chunk) => {
    str = chunk;

    fs.readdir(pathSecond, { withFileTypes: true }, function (err, elements) {
      if (err) {
        throw err;
      }
      elements.forEach((el) => {
        let readableEl = fs.createReadStream(path.join(pathSecond, el.name));
        let same = path.basename(el.name, path.extname(el.name));
        arrSrc.push(readableEl);
        arrTempl.push(same);
        for (let i = 0; i < arrSrc.length; i++) {
          arrSrc[i].on("data", (data) => {
            str = str.replace(`{{${arrTempl[i]}}}`, data);
            if (i === arrSrc.length - 1) writeTemplate.write(str);
          });
        }
      });
    });
  });
});

fs.mkdir(
  path.join(__dirname, "project-dist", "assets"),
  { recursive: true },
  (err) => {
    if (err) throw err;
  }
);

let pathStyleIn = path.join(__dirname, "styles");
let pathStyleOut = path.join(__dirname, "project-dist", "style.css");

fs.readdir(pathStyleIn, { withFileTypes: true }, function (err, items) {
  if (err) {
    throw err;
  }
  const output = fs.createWriteStream(pathStyleOut);
  items.forEach(function (item) {
    let a = path.parse(item.name).ext;
    if (item.isFile() === true && a == ".css") {
      const input = fs.createReadStream(
        path.join(pathStyleIn, item.name),
        "utf-8"
      );
      input.on("data", (chunk) => output.write(chunk));
      input.on("error", (error) => console.log("Error", error.message));
    }
  });
});

function copy(src, dist) {
  fs.readdir(src, { withFileTypes: true }, (err, items) => {
    if (err) {
      throw err;
    }
    for (let item of items) {
      if (item.isDirectory()) {
        let secondSrc = path.join(src, item.name);
        let secondDist = path.join(dist, item.name);
        copy(secondSrc, secondDist);
      } else {
        fs.mkdir(dist, { recursive: true }, function (err) {
          if (err) {
            throw err;
          }
        });
        fs.copyFile(
          path.join(src, item.name),
          path.join(dist, item.name),
          function (err) {
            if (err) throw err;
          }
        );
      }
    }
  });
}

copy(
  path.join(__dirname, "assets"),
  path.join(result, "assets"),
  function (err) {
    if (err) {
      throw err;
    }
  }
);
