const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const acadFile = RegExp(/acad(\d{4}).lsp/);

const content = document.getElementById("content");
const addCadBtn = document.getElementById("add-cad");
const openCadBtn = document.getElementById("open-cad");

let pyProc = null;
let pyPort = null;
// 打开cad软件 通过python脚本
const createPyProc = () => {
  let port = "4242";
  let script = path.join(__dirname, "pydist", "index", "index");
  pyProc = require("child_process").execFile(script, [
    __dirname + "\\8GBY112_C.dwg",
  ]);
};



//得到cad安装目录后 寻找启动配置文件 然后加载cad文件
function addCadPlugin(pathStr, H3dom) {
  fs.readdir(pathStr, function (err, files) {
    let acadFilePath = "";
    if (err) {
      console.log(err);
    }

    if (files instanceof Array == false) {
      H3dom.innerHTML = "出错了 请重试";
      return;
    }

    files.forEach((filesName) => {
      let result = filesName.match(acadFile);
      if (result != null) acadFilePath = result.input;
    });

    fs.readFile(pathStr + acadFilePath, function (err, content) {
      fs.writeFile(
        pathStr + "/" + acadFilePath,
        content.toString() + "\r\n" + "(LOAD “" + __dirname + "\\X2008.lsp”)",
        function (err, writeData) {
          H3dom.innerHTML = "成功加入";
        }
      );
    });
  });
}

addCadBtn.addEventListener("click", function () {
  const H3 = document.createElement("h3");
  const getCadPath = childProcess.fork(__dirname + "//is_autocad.js");
  H3.innerHTML = "正在检索是否安装AutoCad";
  content.appendChild(H3);

  getCadPath.on("message", function (msgObj) {
    console.log(msgObj);
    if (msgObj.code == 3) {
      H3.innerHTML = "安装完成";
      addCadPlugin(msgObj.msg + "Support\\", H3);
    } else {
      H3.innerHTML = msgObj.msg;
    }
  });
});

openCadBtn.addEventListener("click", function () {
  const H3 = document.createElement("h3");
  H3.innerHTML = "正在打开Cad";
  createPyProc();
  content.appendChild(H3);
});
