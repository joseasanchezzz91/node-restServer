const jwt = require('jsonwebtoken');


let verifyToken = (req, res, next) =>{
    const token = req.get('token');

    jwt.verify(token, process.env.SEED_TOKEN, (err,decode) =>{

        if(err){
            res.status(401).json({
                ok:false,
                err
            })
        }

        req.user = decode.user;
        next();

    })

}

let verifyRole = (req, res, next) =>{
    const token = req.get('token');

    
        let user =req.user;

        if(user.role === 'ADMIN_ROLE'){
            
            next();
        }else {
            res.status(401).json({
                                ok:false,
                                err:{
                                    message: "El usuario no es Administrador"
                                }
            });
        }


}

let verifyTokenUrl = (req, res, next) =>{
    const token = req.query.token;

    jwt.verify(token, process.env.SEED_TOKEN, (err,decode) =>{

        if(err){
            res.status(401).json({
                ok:false,
                err
            })
        }

        req.user = decode.user;
        next();

    })

}

module.exports = {
    verifyToken,
    verifyRole,
    verifyTokenUrl
}