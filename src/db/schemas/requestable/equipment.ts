import { Schema, model } from 'mongoose'

const equipmentSchema = new Schema({
  type: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  stock: {
    required: true,
    type: Number,
  },
  unitMessure: {
    required: true,
    type: String,
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
  available: {
    required: true,
    type: Boolean,
    default: true
  },
});

const Equipment = model("Equipment", equipmentSchema);

export default Equipment
