const Material = require("../models/material");

//Verbos para materiales
//Post de un material
module.exports.crearMaterial = async (req, res) => {
  const data = new Material({
    clase: req.body.clase,
    descripcion: req.body.descripcion,
    stock: req.body.stock,
    unidadMedida: req.body.unidadMedida,
    enUso: [],
    enReparacion: 0,
    disponible: req.body.disponible,
  });

  try {
    const dataToSave = await data.save();
    return res.status(200).json(dataToSave);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
module.exports.getMaterial = async (req, res) => {
  const buscar = req.query.buscar;

  try {
    let consulta = {
      material: { $regex: buscar, $options: "i" },
    };

    if (buscar) {
      consulta = {
        $and: [
          { descripcion: { $regex: buscar, $options: "i" } },
          { disponible: true } 
        ],
      };
    }

    const materiales = await Material.find(consulta).sort({ clase: 'asc', descripcion: 'asc' });

    return res.json(materiales);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Get All
module.exports.getMateriales = async (req, res) => {
  try {
    const data = await Material.find({ disponible: true });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Get por id
module.exports.getMaterialById = async (req, res) => {
  lista_reactivos;
  try {
    const data = await Material.findById(req.params.id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Update por id
module.exports.updateMaterialById = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Material.findByIdAndUpdate(id, updatedData, options);

    return res.send(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Delete por id
module.exports.deleteMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Material.findByIdAndDelete(id);
    return res.send(
      `Material con descripcion ${data.descripcion} y id ${id} fue eliminado correctamente`
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
