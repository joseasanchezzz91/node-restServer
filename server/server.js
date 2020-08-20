require('./config/config')

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.json("hello world");
});

app.get("/usuarios", (req, res) => {
  res.json("get Usuarios");
});

app.post("/usuarios", (req, res) => {
  let body = req.body;
  res.json("post Usuarios");
  
});

app.put("/usuarios/:id", (req, res) => {
  let id = req.params.id;
  res.json(`put Usuarios ${id}`);
});

app.delete("/usuarios", (req, res) => {
  res.json("delete Usuarios");
});

app.listen(process.env.PORT, () => {
  console.log(`escuchando ${process.env.PORT}`);
});
