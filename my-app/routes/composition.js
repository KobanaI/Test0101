const express = require("express");
const path = require("path");
const formidable =require('formidable')

const fs = require('fs').promises;
const { execFile } = require('child_process');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your-secret-key', // セッション識別用の秘密キー
  resave: false, // セッションが変更されない場合でも保存するか
  saveUninitialized: true, // 初期化されていないセッションを保存するか
  cookie: { 
    maxAge: 60000 * 10 // セッションの有効期限を10分（ミリ秒）に設定
  },
}));



app.get("/", (req, res) => {
  res.render('mainsystem')
});


//画像ファイル追跡2：
// アップロードされた画像をformidableで保存し、main.pyへ
app.post("/process-file", (req, res) => {

  const userSession = req.session;

  if (userSession.absolutePath) {
    deleteBeforeImage(userSession.absolutePath,userSession);
  }
  
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../uploads'); 
  form.keepExtensions = true; // 拡張子を保持

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('処理は現在11')
      console.error("ファイルアップロード中のエラー:", err);
      res.status(500).send("ファイルのアップロード中にエラーが発生しました");
      return;
    }

    
    if (files.file) {
      userSession.uploadedFilePath = files.file[0].filepath;
      userSession.absolutePath = files.file[0].filepath;


      const pythonScriptPath = path.resolve(__dirname, '../my-lib/main.py');
      const args = [pythonScriptPath, userSession.uploadedFilePath];
      execFile('python', args, (error, stdout, stderr) => {
        if (error || stderr) {
          console.error("Pythonでエラー:", error || stderr);
          res.status(500).send("Pythonスクリプトでエラーが発生しました");
          return;
        }
    
        try {
          // stdout が JSON 形式として出力されている前提でパース
          const pythonResult = JSON.parse(stdout);
          const imagePath = pythonResult.path;
          const resolvedPath = path.resolve(imagePath);
          const basePath = path.join(__dirname, './');
          const soutaiPath = path.relative(basePath, resolvedPath);

          console.log("画像のパス:", soutaiPath);
        
          req.session.absolutePath = resolvedPath;
          req.session.fileUrl = soutaiPath.replace(/\\/g, '/');
          console.log("うざいやiggiuiguつ" + req.session.fileUrl);
          res.json(req.session.fileUrl);
        } catch (err) {
          console.error("JSON パースエラー:", err);
          res.status(500).send("Python 出力のパースエラー");
        }
      });

    } else {
      console.log('処理は現在10')
      res.status(400).send("ファイルkkkkがアップロードされていません");
    }
  });

});

function deleteBeforeImage(absolutePath,userSession){
  if(absolutePath){
    console.log('前の画像：ちーすまだ消えてません')
    fs.unlink(absolutePath)
    .then(() => {
      console.log('前の画像が消えました');
      userSession.absolutePath = "";
      userSession.fileUrl = "";
    })
  }
}




module.exports = app;
