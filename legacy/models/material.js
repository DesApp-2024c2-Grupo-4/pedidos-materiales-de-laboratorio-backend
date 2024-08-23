const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  descripcion: {
    required: true,
    type: String,
  },

  unidadMedida: {
    required: true,
    type: String,
  },
  clase: {
    required: true,
    type: String,
  },
  stock: {
    required: true,
    type: Number,
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

module.exports = mongoose.model("Material", dataSchema);
