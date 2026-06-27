const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

class userController {
  async create(req, res) {
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

      const newUser = await User.create({
        username: name,
        email,
        password: passwordHash,
      });
      const refreshToken = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "30d",
        },
      );
      const acessToken = jwt.sign(
        {
          id: newUser._id,
          role: newUser.role,
        },
        process.env.ACESS_SECRET,
        {
          expiresIn: "15min",
        },
      );
      await User.findByIdAndUpdate(newUser._id, { refreshToken: refreshToken });
      res.status(201).json({
        message: "Usuario criado com sucesso",
        refreshToken: refreshToken,
        acessToken: acessToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno" });
    }
  }
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Digite um email valido" });
    }
    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Digite uma senha valida" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email ou senha invalidos" });
    }
    const passwordConfirm = await bcrypt.compare(password, user.password);
    if (!passwordConfirm) {
      return res.status(401).json({ message: "Email ou senha invalidos" });
    }
    try {
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "30d",
        },
      );
      await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });
      const acessToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.ACESS_SECRET,
        {
          expiresIn: "15min",
        },
      );
      res.status(200).json({
        message: "Usuario logado com sucesso",
        refreshToken: refreshToken,
        acessToken: acessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
  async view(req, res) {
    try {
      const id = req.userId;
      const user = await User.findById(id).select(
        "id username email data theme role",
      );
      if (!user)
        return res.status(404).json({ message: "Usuario não encontrado" });
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
  async update(req, res) {
    const id = req.userId;
    const { name, email, password } = req.body;
    const newUser = {};
    if (name && name.trim() !== "") {
      newUser.username = name;
    }
    if (email && email.trim() !== "") {
      newUser.email = email;
    }
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({ message: "Email ja cadastrado" });
    }
    if (password && password.trim() !== "") {
      const passwordHash = await bcrypt.hash(password, 12);
      newUser.password = passwordHash;
    }
    try {
      const user = await User.findByIdAndUpdate(id, newUser, {
        runValidators: true,
        returnDocument: "after",
      });

      res.status(200).json({ message: "Usuario alterado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno" });
    }
  }

  async delete(req, res) {
    const id = req.userId;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario não encontrado" });
      }
      res.status(200).json({ message: "Usuario deletado com sucesso" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno" });
    }
  }
  async refresh(req, res) {
    const refreshHeader = req.headers.authorization;
    if (!refreshHeader) {
      return res.status(400).json({ message: "Token não informado" });
    }
    const token = refreshHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
      const id = decoded.id;
      const user = await User.findById(id);
      if (!user)
        return res.status(404).json({ message: "Usuario não encontrado" });
      if (user.refreshToken !== token)
        return res.status(401).json({ message: "Token invalido" });
      const acessToken = jwt.sign(
        { id: id, role: user.role },
        process.env.ACESS_SECRET,
        { expiresIn: "15min" },
      );
      const refreshToken = jwt.sign({ id: id }, process.env.REFRESH_SECRET, {
        expiresIn: "30d",
      });
      await User.findByIdAndUpdate(id, { refreshToken: refreshToken });
      res
        .status(201)
        .json({ refreshToken: refreshToken, acessToken: acessToken });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Token invalido" });
    }
  }
}
module.exports = new userController();
