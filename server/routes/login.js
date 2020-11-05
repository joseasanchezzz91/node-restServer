const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const User = require("../models/user");

app.post("/login", (req, res) => {


  let body = req.body;
  User.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!user) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos u",
        },
      });
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos  b",
        },
      });
    }

    let token = jwt.sign(
      {
        user,
      },
      process.env.SEED_TOKEN,
      { expiresIn: process.env.EXPIRED_TOKEN }
    );

    res.json({
      ok: true,
      user,
      token,
    });
  });
});

module.exports = app;
