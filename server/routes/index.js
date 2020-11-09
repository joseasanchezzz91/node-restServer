const express = require("express");
const app = express();

app.use(require("./users"));
app.use(require("./login"));
app.use(require("./category"));
app.use(require("./product"));
app.use(require("./uploads"));
app.use(require("./images"));

module.exports = app;
