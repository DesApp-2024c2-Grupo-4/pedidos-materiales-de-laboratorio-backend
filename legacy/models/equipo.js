const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  clase: {
    required: true,
    type: String,
  },
  descripcion: {
    required: true,
    type: String,
  },
  stock: {
    required: true,
    type: Number,
  },
  unidadMedida: {
    required: true,
    type: String,
  },
  enUso: [
    {
      id: {
        type: String,
      },
      fecha_inicio: {
        type: Date,
      },
      fecha_fin: {
        type: Date,
      },
      cantidad: {
        type: Number,
      },
    },
  ],
  enReparacion: {
    type: Number,
  },
  disponible: {
    required: true,
    type: Boolean,
    default: true
  },
});

module.exports = mongoose.model("Equipo", dataSchema);
