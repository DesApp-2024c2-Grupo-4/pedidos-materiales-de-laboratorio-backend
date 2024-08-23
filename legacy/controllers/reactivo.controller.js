const express = require("express");
const router = express.Router();
const Reactivo = require("../models/reactivo");

module.exports.crearReactivo = async (req, res) => {
  const data = new Reactivo({
    cas: req.body.cas,
    descripcion: req.body.descripcion,
    stock: req.body.stock,
    enReparacion: 0,
    disponible: req.body.disponible
  });

  try {
    const dataToSave = await data.save();
    return res.status(200).json(dataToSave);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
module.exports.getReactivo = async (req, res) => {
  const buscar = req.query.buscar;

  try {
    let consulta = {
      reactivo: { $regex: buscar, $options: "i" },
    };

    if (buscar) {
      consulta = {
        $and: [
          { 
            $or: [
              { descripcion: { $regex: buscar, $options: "i" } },
              { cas: { $regex: buscar, $options: "i" } }
            ]
          },
          { disponible: true } 
        ]
      };
    }

    const reactivos = await Reactivo.find(consulta).sort({ clase: 'asc', descripcion: 'asc' });

    return res.json(reactivos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Get All
module.exports.getReactivos = async (req, res) => {
  try {
    const data = await Reactivo.find({ disponible: true });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Get por id
module.exports.getReactivosById = async (req, res) => {
  try {
    const data = await Reactivo.findById(req.params.id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Update por id
module.exports.updateReactivoById = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Reactivo.findByIdAndUpdate(id, updatedData, options);

    return res.send(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Delete por id
module.exports.deleteReactivoById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Reactivo.findByIdAndDelete(id);
    return res.send(
      `Reactivo con descripcion ${data.descripcion} y id ${id} fue eliminado correctamente`
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
