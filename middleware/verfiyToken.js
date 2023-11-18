const JWT = require('jsonwebtoken')

const verifyToken = async (req,res,next)=>{
    const authHeader = req.headers['authorization'] || req.headers['Authorization']

    if (!authHeader){
        return res.json('you need to login')
    }
    
    const token = authHeader.split(' ')[1]

    try{
        const currentUser =  JWT.verify(token,process.env.SECRET_KEY);
        req.currentUser = currentUser;
        next();
    } catch (err) {
        return res.json({status: "error" , msg: err})
    }
    
}


module.exports = verifyToken