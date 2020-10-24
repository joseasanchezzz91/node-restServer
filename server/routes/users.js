const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const app = express();

const User = require("../models/user");

app.get("/", (req, res) => {
  res.json("hello world");
});

app.get("/users", (req, res) => {
  let limit = req.query.limit || 5;
  limit = Number(limit);
  let since = req.query.since || 0;
  since = Number(since);
  User.find({ state: true }, "name email google state role img")
    .skip(since)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      User.count({ state: true }, (err, count) => {
        res.json({
          ok: true,
          size: count,
          users,
        });
      });
    });
});

app.post("/users", (req, res) => {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      user: userDB,
    });
  });
});

app.put("/users/:id", (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["name", "email", "state", "img", "role"]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
});

app.delete("/users/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, user) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!user) {
      res.status(400).json({
        ok: false,
        err: {
          message: "user not found",
        },
      });
    }

    res.json({
      ok: true,
      user,
    });
  });
});

module.exports = app;
