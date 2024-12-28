const express = require("express");
const path = require("path");
const formidable =require('formidable')
const app = express();
const fs = require('fs')
const { exec } = require('child_process');


///composition/
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload a Photoえくす</title>
    </head>
    <body>
        <h1>Upload a Photo EXpressdsafdsa</h1>
        <form id="form1" enctype="multipart/form-data" action= "/composition/process-file" method="POST">
            <input type="file" name="file" id="fileInput" accept="image/*" required>
            <button type="submit">Upload</button>
        </form>

        <img src="https://k-net01.com/wp-content/uploads/2019/08/get-image-url-03.jpg" alt="画像">

<script>

document.getElementById("form1").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  try {
    const response = await fetch("/composition/process-file", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("アップロード成功:", data);

      // アップロードされたファイルの表示ページにリダイレクト
      window.location.href = "/composition/process-file";
    } else {
      console.error("アップロードに失敗しました");
      alert("アップロードに失敗しました");
    }
  } catch (error) {
    console.error("リクエストエラー:", error);
    alert("リクエスト中にエラーが発生しました");
  }
});

</script>

    </body>
    </html>
  `);
});

let uploadedFilePath = "";

///composition/process-file
app.post("/process-file", (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../uploads'); // 保存ディレクトリ
  form.keepExtensions = true; // 拡張子を保持

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("ファイルアップロード中のエラー:", err);
      res.status(500).send("ファイルのアップロード中にエラーが発生しました");
      return;
    }

    
    if (files.file) {
      uploadedFilePath = files.file[0].filepath; // ファイルパスを格納
      sendToPython(res);
    } else {
      res.status(400).send("ファイルfdsがアップロードされていません");
    }
  });

});


function sendToPython(res){
  
  const pythonScriptPath = path.resolve(__dirname, '../my-lib/main.py');
  const pythonCommand = `python "${pythonScriptPath}" "${uploadedFilePath}"`;
  exec(pythonCommand, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Pythonエラー:", error? error:stderr);
    }
    else{
      res.json({ message: "処理成功!!!", pythonOutput: stdout });
    }

  });
}

//ここめちゃくちゃ苦労した
let fileUrl = "";
let absolutePath = "";
app.post("/completeChangeImg", (req,res)=>{
  const resolvedPath = path.resolve(req.body.path);
  absolutePath = resolvedPath;
  const basePath = path.join(__dirname,'./'); //ここよくわかっていない
  const relativePath = path.relative(basePath, resolvedPath);
  const finalPath = relativePath.replace(/\\/g, '/');
  console.log('変換された相対パス:', finalPath);
  fileUrl = relativePath.replace(/\\/g, '/');
  res.redirect('/process-file')
})

///composition/process-file
app.get("/process-file", (req, res) => {
  if (!fileUrl) {
    res.status(400).send("画像のデータが消失したため、もう一度やり直してください");
    return;
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Result</title>
    </head>
    <body>
        <h1>Uploaded File</h1>
        <img src="${fileUrl}" alt="Uploaded Image" style="max-width: 100%; height: auto;">
        <p>ファイルパス: ${fileUrl}</p>
    </body>
    </html>
  `);

  const deleteDelay = 1000; // 1秒後に削除
  setTimeout(() => {
    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error('ファイルの削除に失敗しました:', err);
      } else {
        console.log('ファイルが削除されました:', absolutePath);
      }
    });
  }, deleteDelay);


});

module.exports = app;


