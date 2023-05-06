const fs = require("fs");
const path = require("path");
const streamWrite = fs.createWriteStream(path.join(__dirname, "text.txt"));
let { stdout, stdin, exit } = require("process");

stdout.write("Type in your text:");

stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    endProc();
  } else {
    streamWrite.write(data);
  }
});

function endProc() {
  stdout.write("Goodbyе");
  exit();
}

process.on("SIGINT", endProc);
