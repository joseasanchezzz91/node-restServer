const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const Product = require('../models/product');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {
  if (!req.files) {
    return res.status(400).json({
        ok: false,
        err:{
            message: "No viene el Archivo"
        }
    });
  }

  let type = req.params.type;
  let id = req.params.id;

  let typeValid = ['products','users'];

  if(typeValid.indexOf(type)< 0){
    return res.status(400).json({
        ok: false,
        err:{
            message: `El tipo  ${type} no es validad, solo se permiten ${typeValid.join(', ')}.`
        }
    })
 }


  let file = req.files.file;
  let nameFile = file.name.split('.');
  let extension = nameFile[nameFile.length - 1]

  let extenValid = ['png','jpg','git','jpeg','svg']

  if(extenValid.indexOf(extension)< 0){
     return res.status(400).json({
         ok: false,
         err:{
             message: `La extension  ${extension} no es validad, solo se permiten ${extenValid.join(', ')}.`
         }
     })
  }
  let name = `${id}-${new Date().getMilliseconds()}.${extension}`
  
  file.mv(`uploads/${type}/${name}`, function(err) {
    if (err)
      return res.status(500).json({
    ok:false,
    err  
    });

  switch(type){
      case 'users':
          imgUser(id,res,name)
          break;
          case 'products':
              imgProduct(id,res,name)
              break;
         default: 
              return null;
  }

 
  });
});


const imgUser = (id,res, name) => {
    User.findById(id,(err,userDB)=>{
        if(err){
            deleteFile(name, 'users')
          return  res.status(500).json({
                ok:false,
                err
            })
        }

        if(!userDB){
            deleteFile(name, 'users')
            return  res.status(400).json({
                  ok:false,
                  err:{
                      message: "Usuario no existe"
                  }
              })
          }

          deleteFile(userDB.img, 'users')

            userDB.img = name;
            userDB.save((err,user)=>{
                if(err){
                    return  res.status(500).json({
                          ok:false,
                          err
                      })
                  }

               return   res.json({
                      ok: true,
                      user
                  })
            })



    })
}
const imgProduct = (id,res, name) => {
    Product.findById(id,(err,productDB)=>{
        if(err){
            deleteFile(name, 'products')
          return  res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productDB){
            deleteFile(name, 'products')
            return  res.status(400).json({
                  ok:false,
                  err:{
                      message: "Producto no existe"
                  }
              })
          }

          deleteFile(productDB.img, 'products')
          productDB.img = name;
          productDB.save((err,product)=>{
                if(err){
                    return  res.status(500).json({
                          ok:false,
                          err
                      })
                  }

               return   res.json({
                      ok: true,
                      product
                  })
            })



    })
}

const deleteFile =(name,type)=>{
    let pathImg = path.resolve(__dirname,`../../uploads/${type}/${name}`);
    if(fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;