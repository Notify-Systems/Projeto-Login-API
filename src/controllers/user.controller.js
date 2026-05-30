const bcrypt = require ("bcrypt")
const UserModel = require("../models/UserModel")

async function addUser(req,res){
    const { name, email, password, confirmPassword } = req.body
    if (!name || name.trim() === ""){
        return res.status(400).json({message:"Digite um nome valido"})
    }
    if (!email || email.trim() === ""){
        return res.status(400).json({message:"Digite um email valido"})
    }
    
    if (!password || password.trim() === ""){
        return res.status(400).json({message:"Digite uma senha valida"})
    }
    if (!confirmPassword || confirmPassword.trim() === ""){
        return res.status(400).json({message:"Confirme sua senha"})
    }
    if(confirmPassword !== password){
        return res.status(400).json({message:"A senha confirmada é diferente da senha posta"})
    }
    try{
    const passwordHash = await bcrypt.hash(password, 12)
    const newUser = await UserModel.create({
        username: name,
        email,
        password: passwordHash
    })
    res.status(201).json({message: "Usuario cadastrado com sucesso"});
    }catch(error){
        res.status(500).json({message: "Erro interno"})
    }
}
async function login(req, res){
    const {email, password} = req.body
    const usuario = await UserModel.findOne({email: email})
    if (!usuario){
        return res.status(404).json({message: "Usuario não encontrado"})
    }
    passwordConfirm = await bcrypt.compare(password, usuario.password)
    if(passwordConfirm){
        return res.status(200).json({message: "Login realiziado com sucesso"})
    }
    return res.status(401).json({message: "Senha invalida"})
}
module.exports = {
    addUser, login
}