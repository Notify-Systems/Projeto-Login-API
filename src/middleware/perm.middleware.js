function permissionAdm(req,res,next){
    const role = req.userRole
    if(role != "admin"){
        return res.status(403).json({message: "Acesso negado"})
    }

    next()
}

module.exports = permissionAdm