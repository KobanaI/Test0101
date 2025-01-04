const express = require("express");
const app = express();
const fs = require('fs').promises;

app.get("/", (req, res) => {
  const imgsrc = req.query.imgsrc; 
  const deletePath = req.query.resultImgPath; 
  
  console.log("result page imgsrc:", imgsrc);
  res.render("result", { filepath: imgsrc });


  setTimeout(() => {
    if (deletePath) {
      deleteImage(deletePath);
    }
  }, 50000);  // 50秒後に削除
});


function deleteImage(deletePath){

  if(deletePath==""||!deletePath){
    console.error("ファイルのパスがねえ")
    return;
  }

  
  fs.unlink(deletePath)
  .then(() => {
    console.log('時間経過で画像消した！');
  }).catch((error) => {
    console.error('すでに消えてるかも');
  });
}
module.exports = app;
