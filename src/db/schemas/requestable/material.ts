import { Schema, model } from 'mongoose'

const materialSchema = new Schema({
  description: {
    required: true,
    type: String,
  },

  unitMessure: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  stock: {
    required: true,
    type: Number,
  },
  inUse: [
    {
      id: {
        type: String,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  inRepair: {
    type: Number,
  },
  isAvailable: {
    required: true,
    type: Boolean,
    default: true
  },
});

const Material = model("Material", materialSchema);

export default Material
