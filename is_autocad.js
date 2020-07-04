
// 获取cad安装目录
const regedit = require("regedit");
let isFind = false;

function getPath(path) {
  regedit.list(path, function (err, result) {
    if (err) {
      process.send({ code: 1, msg: "出错了" });
      process.exit();
    }
    if (result[path].values && isFind) {
      const content = result[path].values;

      Object.keys(content).forEach((key) => {
        if (key == "INSTALLDIR") {
          let cadPath = content["INSTALLDIR"].value;
          console.log(cadPath)
          process.send({ code: 3, msg: cadPath });
          process.exit();
        }
      });
    }

    if (result[path].keys) {
      if (isFind) return;
      const allSoftWare = result[path].keys;
      const LENGTH = allSoftWare.length;
      for (let i = 0; i < LENGTH; i++) {
        if (allSoftWare[i] == "Install") {
          isFind = true;
          getPath(path + "\\" + allSoftWare[i]);
        } else {
          getPath(path + "\\" + allSoftWare[i]);
        }
      }
    }
  });
}

function getCadPath() {
  regedit.list("HKLM\\SOFTWARE", function (err, result) {
    let IsInstall = false;
    if (err) {
      process.send({ code: 1, msg: "出错了" });
      process.exit();
    }

    let allSoftWare = result["HKLM\\SOFTWARE"].keys;
    allSoftWare.forEach((SoftWare) => {
      if (SoftWare == "Autodesk") {
        IsInstall = true;
        getPath("HKLM\\SOFTWARE" + "\\" + SoftWare);
      }
    });
    if (IsInstall == false) {
      process.send({ code: 2, msg: "没有安装AutoCad吧" });
      process.exit();
    }
  });
}
getCadPath();
// module.exports = getCadPath;
