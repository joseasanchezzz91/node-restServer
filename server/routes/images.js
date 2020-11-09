const express = require('express')
const path = require('path');
const fs = require('fs');
const { verifyTokenUrl } = require('../middleware/autorisation');

const app = express();


app.get('/images/:type/:img',verifyTokenUrl,(req,res)=>{

    let type = req.params.type;
    let img = req.params.img;
  

   let pathImg = path.resolve(__dirname,`../../uploads/${type}/${img}`);

   if(fs.existsSync(pathImg)){
       res.sendFile(pathImg);
   }else{
       let noPathImg = path.resolve(__dirname,'../assets/no-image.jpg');
       res.sendFile(noPathImg);

   }









    
});
















module.exports = app;