const jwt = require("jsonwebtoken");


const generateToken = (user,res) =>{

let token = jwt.sign({
    user
  },process.env.SEED_TOKEN,{ expiresIn: process.env.EXPIRED_TOKEN})

  return res.json({
    ok: true,
    user,
    token
  });
}

module.exports = {
    generateToken
}