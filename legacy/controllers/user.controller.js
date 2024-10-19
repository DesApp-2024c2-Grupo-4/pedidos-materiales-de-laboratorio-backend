const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
//Get All
module.exports.getUsers = async (req, res) => {
  try {
    const data = await Usuario.find();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Get por id
module.exports.getUserById = async (req, res) => {
  try {
    const data = await Usuario.findById(req.params.id);
    const {dni, matricula} = data
    return res.json({dni, matricula});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAdminById = async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id);
    let { admin} = user._doc    
    return res.json(admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports.getUser = async (req, res) => {
  const buscar = req.query.buscar;
  try {
    let consulta = {};
    if (buscar !== undefined) {
      if (!isNaN(buscar)) {
        consulta = {
          $or: [
            { usuario: { $regex: buscar, $options: "i" } },
            { dni: Number(buscar) },
          ],
        };
      } else {
        consulta = {
          usuario: { $regex: buscar, $options: "i" },
        };
      }
    }

    const usuarios = await Usuario.find(consulta).sort({ descripcion: 'asc' });;

    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Update por id
module.exports.updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    let { contrasenia, ...props } = updatedData;
    contrasenia = Buffer.from(contrasenia, "base64").toString()
    const options = { new: true };

    let user = await Usuario.findById(id);
    const passChanged = await user.comparePassword(contrasenia);
    if (!passChanged) {
      user.contrasenia = contrasenia;
      await user.save();
    }

    user = await Usuario.findByIdAndUpdate(id, props, options);
    return res.send(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//Delete por id
module.exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Usuario.findByIdAndDelete(id);
    return res.send(
      `Usuario con nombre ${data.nombre} y id ${id} fue eliminado correctamente`
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
