import { Schema, model } from 'mongoose'

const reactiveSchema = new Schema({
  description: {
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
  inUse: {
    type: Number,
  },
  isAvailable: {
    required: true,
    type: Boolean,
    default: true
  },
});

const Reactive = model("Reactive", reactiveSchema);

export default Reactive