const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  descripcion: {
    required: true,
    type: String,
  },
  cas: {
    required: true,
    type: String,
  },
  stock: {
    type: Number,
  },
  enUso: {
    type: Number,
  },
  disponible: {
    required: true,
    type: Boolean,
    default: true
  },
});

module.exports = mongoose.model("Reactivo", dataSchema);
