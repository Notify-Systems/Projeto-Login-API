const jwt = require("jsonwebtoken")
function auth (req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(400).json({message: "Token não informado"})
    }
    const acessToken = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(acessToken, process.env.ACESS_SECRET)
        req.userId = decoded.id
        req.userRole = decoded.role

        next()
    }catch(error){
        console.log(error)
        if (error.name == "TokenExpiredError"){
            return res.status(401).json({message: "Token expirado, renove com o refresh token", erro:error.name})
        }
        res.status(401).json({message:"Erro interno"})
    }
}

module.exports = auth