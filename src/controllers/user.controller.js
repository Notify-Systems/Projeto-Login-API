const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

async function addUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Digite um nome valido" });
  }
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Digite um email valido" });
  }
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(400).json({ message: "Email ja cadastrado" });
  }
  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Digite uma senha valida" });
  }
  if (!confirmPassword || confirmPassword.trim() === "") {
    return res.status(400).json({ message: "Confirme sua senha" });
  }
  if (confirmPassword !== password) {
    return res
      .status(400)
      .json({ message: "A senha confirmada é diferente da senha posta" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create({
      username: name,
      email,
      password: passwordHash,
    });
    res.status(201).json({message: "Usuario criado com sucesso"});
  } catch (error) {
    res.status(500).json({ message: "Erro interno" });
  }
}
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Digite um email valido" });
  }
  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Digite uma senha valida" });
  }
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "Email ou senha invalidos" });
  }
  const passwordConfirm = await bcrypt.compare(password, user.password);
  if (!passwordConfirm) {
    return res.status(401).json({ message: "Email ou senha invalidos" });
  }
  try {
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno" });
  }
}
async function infoUsuario(req, res) {
  try {
    const id = req.userId;
    const user = await UserModel.findById(id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Usuario não encontrado" });
  }
}
async function alterarUsuario(req, res) {
  const id = req.userId;
  const { name, email, password } = req.body;
  const newUser = {};
  if (name && name.trim() !== "") {
    newUser.username = name;
  }
  if (email && email.trim() !== "") {
    newUser.email = email;
  }
  const emailExist = await UserModel.findOne({ email: email });
  if (emailExist) {
    return res.status(400).json({ message: "Email ja cadastrado" });
  }
  if (password && password.trim() !== "") {
    const passwordHash = await bcrypt.hash(password, 12);
    newUser.password = passwordHash;
  }
  try {
    const user = await UserModel.findByIdAndUpdate(id, newUser, {
      runValidators: true,
      returnDocument: "after",
    });

    res.status(200).json({ message: "Usuario alterado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno" });
  }
}

async function autoDelete(req, res) {
  const id = req.userId;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }
    res.status(200).json({ message: "Usuario deletado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno" });
  }
}
module.exports = {
  addUser,
  login,
  infoUsuario,
  alterarUsuario,
  autoDelete
};
