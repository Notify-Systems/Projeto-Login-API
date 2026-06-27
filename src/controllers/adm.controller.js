const User = require("../models/UserModel");
class admController {
  async deleteUser(req, res) {
    const {email} = req.body;
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Digite um email valido" });
    }
    try {
      const user = await User.findOne({ email: email });
      if (user.role == "admin") {
        res.status(403).json({ message: "Esse usuario não pode ser deletado" });
      }
      await User.findOneAndDelete({ email: email });
      res
        .status(200)
        .json({ message: `O usuario ${user.name} foi deletado com sucesso` });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "Usuario não encontrado" });
    }
  }

  async viewUser(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
}

module.exports = new admController
