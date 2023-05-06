const fs = require("fs");
const path = require("path");

let streamRead = fs.createReadStream(path.join(__dirname, "text.txt"), "utf8");

streamRead.on("data", (data) => console.log(data));
