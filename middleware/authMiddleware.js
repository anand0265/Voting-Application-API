const jwt = require('jsonwebtoken')

module.exports = async(req,res,next)=>{
    try {
    //get token
    const token = req.headers["authorization"].split(" ")[1]
    jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
        if(err){
            return res.status(401).send({
                success:false,
                message:"UnAuthorize User"
            })
        }else{
            req.body.id = decode.id;
            next();
        }
    })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Auth API"
        })
    }
}