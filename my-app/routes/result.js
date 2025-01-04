const express = require("express");
const app = express();

app.get("/", (req, res) => {
  //console.log("Rendering result page with fileUrl:", req.query.fileUrl);
  //res.render('result',{ filepath: req.query.fileUrl })
});

module.exports = app;
