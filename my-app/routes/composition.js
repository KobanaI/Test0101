const express = require("express");
const path = require("path");
const formidable =require('formidable')
const app = express();
const fs = require('fs').promises;
const { exec } = require('child_process');

app.get("/", (req, res) => {
  res.render('mainsystem')
});

let uploadedFilePath = "";


//画像ファイル追跡2：
// アップロードされた画像をformidableで保存し、main.pyへ
app.post("/process-file", (req, res) => {

  console.log('処理は現在app.post("/process-file"')
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../uploads'); 
  form.keepExtensions = true; // 拡張子を保持

  console.log('処理は現在2')
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('処理は現在11')
      console.error("ファイルアップロード中のエラー:", err);
      res.status(500).send("ファイルのアップロード中にエラーが発生しました");
      return;
    }

    
    if (files.file) {
      uploadedFilePath = files.file[0].filepath;
      console.log('ファイルパスを格納しました'+uploadedFilePath)
      sendToPython(res);
    } else {
      console.log('処理は現在10')
      res.status(400).send("ファイルkkkkがアップロードされていません");
    }
  });

});

function sendToPython(res){

  const pythonScriptPath = path.resolve(__dirname, '../my-lib/main.py');
  //console.log(`pythonScriptPathは    ${pythonScriptPath}`)
  const pythonCommand = `python "${pythonScriptPath}" "${uploadedFilePath}"`;

  //console.log(`pythonCommand は   ${pythonCommand}`)
  exec(pythonCommand, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Pythonでエラー:", error? error:stderr);
    }
    else{
      res.json({ message: "処理成功!!!", pythonOutput: stdout });
    }

  });
}



let fileUrl = "";
let absolutePath = "";
//画像ファイル追跡4：
// 加工した画像を、HTMLのsrcで使える形に変換し、ついに表示される

app.post("/completeChangeImg", (req,res)=>{

  //まじわからん
  //console.log('処理は現在 app.post("/completeChangeImg", (req,res)=>{')
  const resolvedPath = path.resolve(req.body.path);
  absolutePath = resolvedPath;

  const basePath = path.join(__dirname,'./');
  const relativePath = path.relative(basePath, resolvedPath);
  fileUrl = relativePath.replace(/\\/g, '/');
  res.redirect('/composition/displayResults')
})


app.get("/displayResults", (req, res) => {
  res.render('result',{filepath:fileUrl})

  const deleteDelay = 60000; // 1秒後に削除
  setTimeout(() => {

    fs.access(absolutePath)
  .then(() => fs.unlink(absolutePath))
  .then(() => console.log('ファイルが削除されました:', absolutePath))
  .catch((err) => {
    if (err.code === 'ENOENT') {
      console.warn('削除対象ファイルが存在しません:', absolutePath);
    } else {
      console.error('ファイルの削除に失敗しました:', err);
    }
  });
  }, deleteDelay);
});


module.exports = app;


