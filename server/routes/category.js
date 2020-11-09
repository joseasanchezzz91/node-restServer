const express = require('express');
const Category = require('../models/category');

const {verifyToken, verifyRole} = require('../middleware/autorisation');

const app = express();


app.get('/category', verifyToken,(req,res)=>{

    Category.find({})
    .sort('description')
    .populate('user','name email')
    .exec( (err,categories)=>{

        if(err){
            res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            categories
        })

    });

});

app.get('/category/:id', verifyToken,(req,res)=>{

    let id = req.params.id

    Category.findById(id,(err,category)=>{
        if(err){
            res.status(500).json({
                ok:false,
                err
            });
        }

        if(!category){
            res.status(400).json({
                ok: false,
                err:{
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            category
        })
    })


});

app.post('/category', [verifyToken, verifyRole],(req,res)=>{

    let body = req.body;
    let user = req.user;


    let category = new Category({
        description: body.description,
        user: user._id

    })

    category.save((err,category)=>{

        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }

        if(!category){
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category
        })

    })


});

app.put('/category/:id', [verifyToken, verifyRole],(req,res)=>{

    let id = req.params.id
    let body = req.body
    let descCategory =  {description: body.description}

    Category.findByIdAndUpdate(id,
       descCategory,{new: true, runValidators:true},(err,category)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!category){
                res.status(400).json({
                    ok: false,
                    err
                })
            }



            res.json({
                ok: true,
                category
            })

        });
});

app.delete('/category/:id',[verifyToken,verifyRole],(req,res)=>{
let id =req.params.id

Category.findByIdAndRemove(id,(err,category)=>{
    if(err){
        res.status(500).json({
            ok: false,
            err
        });
    }

    if(!category){
        res.status(400).json({
            ok: false,
            err:{
                message: 'El id no existe'
            }
        })
    }

    res.json({
        ok: true,
        category
    })
})

});











module.exports = app