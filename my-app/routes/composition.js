const express = require("express");
const path = require("path");
const formidable =require('formidable')
const fs = require('fs').promises;
const { execFile } = require('child_process');

const app = express();

const DebugMode = false;

function deb(number){
  if(!DebugMode)return;
  console.log(`現在の処理は${number}`);
}


app.get("/", (req, res) => {
  res.render('mainsystem',{bodyClass:'main'})
});


//Process２：
// アップロードされた画像をformidableで保存し、main.pyへ
app.post("/process-file", (req, res) => {
  deb(0);
  const userSession = req.session;
  userSession.zettai && deleteBeforeImage(userSession.zettai,userSession);
  saveAndEdit(req,res,userSession);

});

function saveAndEdit(req,res,userSession){
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../uploads'); 
  form.keepExtensions = true;

  deb(1);

  //ここで画像をいったん保存
  form.parse(req, (err, fields, files) => {
    
    if (!files.file){
      res.status(400).send("ファイルがねえ");
      return;
    }
    deb(10);
    userSession.uploadedFilePath = files.file[0].filepath;
    userSession.zettai = files.file[0].filepath;

    
    //ここで画像ファイル以外を弾く
    const uploadedFile = files.file[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      res.status(400).send('画像ファイルのみアップロードできます');
      return;
    }
    //でかいfileを送らせない
    form.maxFileSize = 10 * 1024 * 1024;

    const pythonScriptPath = path.resolve(__dirname, '../my-lib/main.py');
    const args = [pythonScriptPath, userSession.uploadedFilePath];

    deb(11);
    execFile('python', args,  (error, stdout, stderr) => {
      if (error || stderr) {
        
        console.error("Pythonでエラー:", error || stderr);
        res.status(500).send("エラーが発生しましたp");
        return;
      }
      deb(100);
        const imagePath = JSON.parse(stdout).path;
        const zettai = path.resolve(imagePath);
        const soutai = path.relative(path.join(__dirname, './'), zettai);
        console.log("画像のパス:", soutai);
        
        req.session.zettai = zettai;
        req.session.imgsrc = soutai.replace(/\\/g, '/');

        res.json(true);
      });
  });
}



//短時間に2度uploadすると、上書きされて削除されないため、ここで強制的に削除
function deleteBeforeImage(zettai,userSession){

  if(zettai==""|| !zettai){
    console.error("ファイルパスが無")
    return;
  }

  fs.unlink(zettai)
  .then(() => {
    console.log('前の画像消した。もう一回遊べるドン');
    userSession.zettai = "";
    userSession.imgsrc = "";

  }).catch((error) => {
    console.error('削除失敗');
    userSession.zettai = "";
    userSession.imgsrc = "";
  });
}

module.exports = app;
