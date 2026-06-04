const jwt = require("jsonwebtoken")
function auth (req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(400).json({message: "Token não informado"})
    }
    const token = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(token, process.env.SECRET)
        req.userId = decoded.id
        req.userRole = decoded.role

        next()
    }catch(error){
        console.log(error)
        res.status(401).json({message:"Erro interno"})
    }
}

module.exports = auth