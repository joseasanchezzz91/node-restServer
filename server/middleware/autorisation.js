const jwt = require('jsonwebtoken');


let verifyToke = (req, res, next) =>{
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

module.exports = {
    verifyToke,
    verifyRole
}