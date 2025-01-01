const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>サイト</title>
    </head>
    <body>
        <h1>作るサイトでerす。下のボタンでuysssd開始してください</h1>
        <p>を加工するのは著作権がどうたらこうたら。このサイトおすすめ</p>
        <a>https://blog.bestprints.biz/free-photo/</a>

        <a href="/composition">結果ページへ</a>
    </body>
    </html>
  `);
});

module.exports = app;
