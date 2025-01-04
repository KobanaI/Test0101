const express = require("express");
const path = require("path");
const formidable =require('formidable')
const fs = require('fs').promises;
const { execFile } = require('child_process');
const { setTimeout } = require("timers/promises");

const app = express();
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key', // セッション識別用の秘密キー
  resave: false, // セッションが変更されない場合でも保存するか
  saveUninitialized: true, // 初期化されていないセッションを保存するか
}));



app.get("/", (req, res) => {
  res.render('mainsystem')
});


//画像ファイル追跡2：
// アップロードされた画像をformidableで保存し、main.pyへ
app.post("/process-file", (req, res) => {

  const userSession = req.session;
  if (userSession.zettai) {
    deleteImagefast(userSession.zettai,userSession);
  }
  
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../uploads'); 
  form.keepExtensions = true; // 拡張子を保持

  form.parse(req, (err, fields, files) => {
    

    if (!files.file){
      res.status(400).send("ファイルkkkkがアップロードされていません");
      return;
    }
    userSession.uploadedFilePath = files.file[0].filepath;
    userSession.zettai = files.file[0].filepath;

    const pythonScriptPath = path.resolve(__dirname, '../my-lib/main.py');
    const args = [pythonScriptPath, userSession.uploadedFilePath];

    execFile('python', args,  (error, stdout, stderr) => {
      if (error || stderr) {
        console.error("Pythonでエラー:", error || stderr);
        res.status(500).send("Pythonスクリプトでエラーが発生しました");
        return;
      }
        const imagePath = JSON.parse(stdout).path;
        const zettai = path.resolve(imagePath);
        const soutai = path.relative(path.join(__dirname, './'), zettai);
        console.log("画像のパス:", soutai);
        
        req.session.zettai = zettai;
        req.session.imgsrc = soutai.replace(/\\/g, '/');

        //pugでつかうimg-srcと、保存してる写真のpathを送る（後で消すため）
        res.json({
          imgsrc: req.session.imgsrc,
          resultImgPath: req.session.zettai
        });
      });
  });

});

//短時間に2度uploadすると、上書きされて削除されないため、ここで強制的に削除
function deleteImagefast(zettai,userSession){

  if(zettai==""|| !zettai){
    console.error("ファイルのパスが無")
    return;
  }

  fs.unlink(zettai)
  .then(() => {
    console.log('前の画像消した。もう一度遊べるドン');
    userSession.zettai = "";
    userSession.fileUrl = "";

  }).catch((error) => {
    console.error('削除失敗');
    userSession.zettai = "";
    userSession.fileUrl = "";
  });
}

module.exports = app;
