const express = require('express');
const { LoginTicket } = require('google-auth-library');
const { verifyToken} = require('../middleware/autorisation');
const product = require('../models/product');

const Product = require('../models/product');


const app = express();


app.get('/product',verifyToken,(req,res)=>{


    let limit = req.query.limit || 5;
    limit = Number(limit);
    let since = req.query.since || 0;
    since = Number(since);
    Product.find({status: true})
    .sort('name')
    .skip(since)
    .limit(limit)
    .populate('user','name email')
    .populate('category','description')
    .exec((err,products)=>{
        if(err){
         return  res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            products
        })

    })
    
});


app.get('/product/:id',verifyToken,(req,res)=>{
    let id = req.params.id

    Product.findById(id,(err,product)=>{
        if(err){
         return   res.status(500).json({
                ok: false,
                err
            })
        }

        if(!product){
          return  res.status(400).json({
                ok: false,
                err:{
                    message: "Producto no encontrado"
                }
            })
        }


        res.json({
            ok: true,
            product
        })
    }).populate('user','name email')
    .populate('category','description')

});


app.get('/product/search/:search',verifyToken,(req,res)=>{

    let search = req.params.search;
    let regex = new RegExp(search,'i')
    Product.find({ name: regex})
    .populate('user',' name email')
    .populate('category','description')
    .exec((err,products)=>{
        if(err){
            return   res.status(500).json({
                   ok: false,
                   err
               })
           }

           res.json({
               ok: true,
               products
           })
    })

});



app.post('/product',verifyToken,(req,res)=>{
    let body = req.body;
    let user = req.user;
    

    let product = new Product({
        name: body.name,
        status: body.status,
        description: body.description,
        price: body.price,
        category: body.category,
        user: user._id
    })


    product.save((err,product)=>{
        if(err){
          return  res.status(500).json({
                ok: false,
                err
            })
        }


        res.status(201).json({
            ok: true,
            product
        })

    });


});



app.put('/product/:id',verifyToken,(req,res)=>{

    let id = req.params.id;
    let body = req.body;

   Product.findById(id,(err,productDB)=>{
    if(err){
        return  res.status(500).json({
              ok: false,
              err
          })
      }

      if(!productDB){
        return  res.status(500).json({
              ok: false,
              err:{
                  message: "El producto no existe"
              }
          })
      }

      productDB.name= body.name,
      productDB.description= body.description,
      productDB.price= body.price,
      productDB.status= body.status,
      productDB.category= body.category

      productDB.save((err,product)=>{
        if(err){
            return  res.status(500).json({
                  ok: false,
                  err
              })
          }

          res.json({
              ok: true,
              product
          })
      })

   });

});


app.delete('/product/:id',verifyToken,(req,res)=>{

    let id = req.params.id;

    Product.findById(id,(err,productDB) =>{
        if(err){
          return  res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productDB.status){
            return  res.status(500).json({
                  ok: false,
                  err:{
                      message: "Producto no existe"
                  }
              })
          }

          productDB.status = false;
          productDB.save((err,product)=>{

            if(err){
                return  res.status(500).json({
                      ok: false,
                      err
                  })
              }

              res.json({
                  ok:true,
                  product
              })



          })




    })



});












module.exports = app