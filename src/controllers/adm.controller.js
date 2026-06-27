const User = require("../models/UserModel");

async function deleteUsuario(req, res) {
  const email = req.body.email;
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Digite um email valido" });
  }
  try {
    const user = await UserModel.findOne({ email: email });
    if (user.role == "admin") {
      res.status(403).json({ message: "Esse usuario não pode ser deletado" });
    }
    await UserModel.findOneAndDelete({ email: email });
    res
      .status(200)
      .json({ message: `O usuario ${user.name} foi deletado com sucesso` });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Usuario não encontrado" });
  }
}

async function mostrarUsuarios(req, res) {
  try {
    const users = UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro interno" });
  }
}

module.exports = { deleteUsuario, mostrarUsuarios };
