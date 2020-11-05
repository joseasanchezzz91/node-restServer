require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/index"));

mongoose.connect(process.env.URLBD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false, useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;


    console.log("base de datos ONLINE");
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando ${process.env.PORT}`);
});
