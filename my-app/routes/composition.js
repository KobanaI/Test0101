const express = require("express");
const path = require("path");
const formidable =require('formidable')

const fs = require('fs').promises;
const { execFile } = require('child_process');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your-secret-key', // セッションを識別するためのキー
  resave: false,
  saveUninitialized: true,
}));


app.get("/", (req, res) => {
  res.render('mainsystem')
});

let uploadedFilePath = "";


//画像ファイル追跡2：
// アップロードされた画像をformidableで保存し、main.pyへ
app.post("/process-file", (req, res) => {
  if(req.session.isISis){
    console.log("2回目です")
  }
  req.session.isISis = true



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
      //uploadedFilePath = files.file[0].filepath;
      userSession.uploadedFilePath = files.file[0].filepath;
      userSession.absolutePath = files.file[0].filepath; // 画像パスをセッションに保持



      sendToPython2(res,userSession);
      //sendToPython(res);
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
     // userSession.absolutePath = "";
     // userSession.fileUrl = "";
    })
    .catch((err) => {
      console.error('前のファイルの削除に失敗しました:', err);
    });
  }
}

function sendToPython2(res,userSession) {

  const pythonScriptPath = path.resolve(__dirname, '../my-lib/main.py');
  //const args = [pythonScriptPath, uploadedFilePath];
  const args = [pythonScriptPath, userSession.uploadedFilePath];

  execFile('python', args, (error, stdout, stderr) => {
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
// 加工した画像を、HTMLのsrcで使える形に変換し、ついに表示

// app.post("/completeChangeImg", (req,res)=>{


//   //まじわからん
//   const resolvedPath = path.resolve(req.body.path);
  
//   const basePath = path.join(__dirname,'./');
//   const relativePath = path.relative(basePath, resolvedPath);

//   if(req.session.absolutePath){
//     console.log('消すの失敗してるやんけ')
//     res.redirect('/composition/displayResults')
//   }else{
//     req.session.absolutePath = resolvedPath;
//     req.session.fileUrl = relativePath.replace(/\\/g, '/');
//     console.log("うざいやつ"+req.session.absolutePath)
//     console.log("うざいやつ"+req.session.fileUrl)
//     setTimeout(() => {
//       res.redirect('/composition/displayResults');
//     }, 5000);  // 少し遅延させてからリダイレクト
//     //absolutePath = resolvedPath;
//     //fileUrl = relativePath.replace(/\\/g, '/');
//   }
  

// })

app.post("/completeChangeImg", (req, res) => {
  const resolvedPath = path.resolve(req.body.path);
  const basePath = path.join(__dirname, './');
  const relativePath = path.relative(basePath, resolvedPath);

  // セッションに保存
  req.session.absolutePath = resolvedPath;
  req.session.fileUrl = relativePath.replace(/\\/g, '/');

  console.log("うざいやつ" + req.session.absolutePath);
  console.log("うざいやつ" + req.session.fileUrl);

  res.redirect('/composition/displayResults');
});


app.get("/displayResults", (req, res) => {

  console.log("うお直前の！"+req.session.fileUrl)
  console.log('filepath type:', typeof req.session.fileUrl);  // デバッグ用
  res.render('result', { filepath: req.session.fileUrl });
 // res.render('result',{filepath:fileUrl})

  const deleteDelay = 600000;
//   setTimeout(() => {

//     fs.access(absolutePath)
//   .then(() => {
//     fs.unlink(absolutePath)
//     absolutePath = "";//消したら変数もリセット
//   }
   

// )
//   .then(() => console.log('ファイルが削除されました:', absolutePath))
//   .catch((err) => {
//     if (err.code === 'ENOENT') {
//       console.warn('削除対象ファイルが存在しません:', absolutePath);
//     } else {
//       console.error('ファイルの削除に失敗しました:', err);
//     }
//   });
//   }, deleteDelay);
// setTimeout(() => {
//   if (req.session.absolutePath) {
//     fs.access(req.session.absolutePath)
//       .then(() => fs.unlink(req.session.absolutePath))
//       .then(() => {
//         console.log('画像が削除されました:', req.session.absolutePath);
//         req.session.absolutePath = ""; // 変数をリセット
//       })
//       .catch((err) => {
//         if (err.code === 'ENOENT') {
//           console.warn('削除対象ファイルが存在しません:', req.session.absolutePath);
//         } else {
//           console.error('ファイルの削除に失敗しました:', err);
//         }
//       });
//   }
// }, deleteDelay);
});


module.exports = app;


// const express = require("express");
// const path = require("path");
// const formidable = require('formidable');
// const fs = require('fs').promises;
// const { execFile } = require('child_process');

// const app = express();

// // グローバル変数にファイルパスを保持する
// let uploadedFilePath = "";
// let fileUrl = "";
// let absolutePath = "";

// app.get("/", (req, res) => {
//   res.render('mainsystem');
// });

// // 画像ファイルアップロードの処理
// app.post("/process-file", (req, res) => {
//   const form = new formidable.IncomingForm();
//   form.uploadDir = path.join(__dirname, '../uploads'); 
//   form.keepExtensions = true; // 拡張子を保持

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.log('処理は現在11');
//       console.error("ファイルアップロード中のエラー:", err);
//       res.status(500).send("ファイルのアップロード中にエラーが発生しました");
//       return;
//     }

//     if (files.file) {
//       uploadedFilePath = files.file[0].filepath;
//       absolutePath = files.file[0].filepath; // 画像パスを保持

//       sendToPython2(res);
//     } else {
//       console.log('処理は現在10');
//       res.status(400).send("ファイルがアップロードされていません");
//     }
//   });
// });

// function sendToPython2(res) {
//   const pythonScriptPath = path.resolve(__dirname, '../my-lib/main.py');
//   const args = [pythonScriptPath, uploadedFilePath];

//   execFile('python', args, (error, stdout, stderr) => {
//     if (error || stderr) {
//       console.error("Pythonでエラー:", error ? error : stderr);
//     } else {
//       res.json({ message: "処理成功!!!", pythonOutput: stdout });
//     }
//   });
// }

// // 画像ファイルの変更処理（セッションなし）
// app.post("/completeChangeImg", (req, res) => {
//   const resolvedPath = path.resolve(req.body.path);
//   const basePath = path.join(__dirname, './');
//   const relativePath = path.relative(basePath, resolvedPath);

//   // ファイルパスをグローバル変数に保存
//   absolutePath = resolvedPath;
//   fileUrl = relativePath.replace(/\\/g, '/');

//   console.log("うざいやつ" + absolutePath);
//   console.log("うざいやつ" + fileUrl);

//   res.redirect('/composition/displayResults');
// });

// app.get("/displayResults", (req, res) => {
//   console.log("うお直前の！" + fileUrl);
//   console.log('filepath type:', typeof fileUrl);  // デバッグ用

//   res.render('result', { filepath: fileUrl });
// });

// module.exports = app;
