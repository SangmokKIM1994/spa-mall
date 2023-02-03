const express = require('express');
const app = express();
const port = 3000;
const goodsRouter = require('./routes/goods.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api", goodsRouter)

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});