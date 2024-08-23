const Equipo = require("../models/equipo");

module.exports.crearEquipo = async (req, res) => {
  const data = new Equipo({
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

module.exports.getEquipo = async (req, res) => {
  const buscar = req.query.buscar;
  try {
    let consulta = {
      equipo: { $regex: buscar, $options: "i" },
    };

    if (buscar) {
      consulta = {
        $and: [
          { descripcion: { $regex: buscar, $options: "i" } },
          { disponible: true } 
        ],
      };
    }

    const equipos = await Equipo.find(consulta).sort({ clase: 'asc', descripcion: 'asc' });
    return res.json(equipos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Get All
module.exports.getEquipos = async (req, res) => {
  try {
    const data = await Equipo.find({ disponible: true });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Get por id
module.exports.getEquipoById = async (req, res) => {
  try {
    const data = await Equipo.findById(req.params.id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//Update por id
module.exports.updateEquipoById = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Equipo.findByIdAndUpdate(id, updatedData, options);

    return res.send(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//Delete por id
module.exports.deleteEquipoById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Equipo.findByIdAndDelete(id);
    return res.send(
      `Equipo con descripcion ${data.descripcion} y id ${id} fue eliminado correctamente`
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
