const express = require("express");
const bcrypt = require("bcrypt");

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const { generateToken} = require('../service/services');

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

               generateToken(user,res)
  });
});

//verificacion en la lib de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
return {
  name: payload.name,
  email: payload.email,
  img: payload.picture,
  google: true
}
}


app.post("/google",async (req, res) => {

  let token = req.body.idtoken

  let googleUser = await verify(token)
                      .catch(err => {
                      return res.status(403).json({
                        ok:false,
                        err
                      })
                      });

User.findOne({email: googleUser.email},(err,userDB)=>{
  if (err) {
    return res.status(500).json({
      ok: false,
      err,
    });
  }

  if(userDB){
      if(!userDB.google){
      
          return res.status(400).json({
            ok: false,
            err:{
              message: 'Debe ingresar con su autenticacion normal'
            },
          });
    
      }else{

        generateToken(userDB,res)

      }
  }else{

    let user = new User()

    user.name = googleUser.name
    user.email = googleUser.email
    user.img = googleUser.img
    user.password = ':)'
    user.google = true

    user.save( (err,user) =>{
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      generateToken(user,res)
    })

  }

});



})





module.exports = app;
