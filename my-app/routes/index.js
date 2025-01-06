const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.render('index',{bodyClass:'lp'})
});

module.exports = app;
