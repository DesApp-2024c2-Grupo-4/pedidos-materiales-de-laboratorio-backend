const Usuario = require("../models/usuario");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

module.exports.register = async (req, res) => {
  try {
    let user = await Usuario.findOne({email: req.body.email});
    if(user) throw { code: 11000 }
    user = new Usuario({
      usuario: req.body.usuario,
      contrasenia: req.body.contrasenia,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
      matricula: req.body.matricula,
      rol: req.body.rol,
      email: req.body.email,
      editor: req.body.editor,
    });
    const userToSave = await user.save();
    let data ={
      _id: userToSave._id,
      nombre: userToSave.nombre,
      apellido: userToSave.apellido,
      rol: userToSave.rol
    } 
    const expiresIn = 60 * 60 * 24 
    const token = jwt.sign({uid: user._id}, process.env.JWT_SECRET, { expiresIn });

    return res.status(200).json({data, token, expiresIn});
  } catch (error) {
    console.log(error);
    if(error.code === 11000) return res.status(400).json({error: "ya existe este usuario"});
    return res.status(500).json({ error: "Error de servidor"}); 
  }
};

//Get por usuario y contrasenia
module.exports.login = async (req, res) => {
  console.log('entering login');
  try {
    const { usuario, password } = req.body;
    const pass = Buffer.from(password, "base64").toString();
    console.log({ password, pass });
    const user = await Usuario.findOne({
      usuario,
    });
    const passValidated = await user.comparePassword(pass);
    if (!passValidated) {
      return res.status(401).json({ auth: "Fallo", token: null });
    }

    let data ={
      _id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol
    } 

    const expiresIn = 60 * 60 * 24 
    const token = jwt.sign({uid: user._id}, process.env.JWT_SECRET, { expiresIn });

    return res.json({data, token, expiresIn });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

