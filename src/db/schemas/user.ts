const bcrypt = require("bcrypt");
import { Schema, model } from 'mongoose'


const userSchema = new Schema({
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  dni: {
    required: true,
    type: Number,
  },
  matricula: { // FIXME: how should we call this?
    required: false,
    type: Number,
  },
  role: {
    required: true,
    type: String,
  },
  isEditor: { // FIXME: why are we using a bool isEditor instead of a role?
    required: true,
    type: Boolean,
  },
  isAdmin: { // FIXME: why are we using a bool isAdmin instead of a role?
    required: false,
    type: Boolean,
  },
  email: {
    required: true,
    type: String,
  },

});

userSchema.pre("save", async function (next) {
  if (!this.isModified("hash")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    throw new Error("Failed to create hashed password: " + error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.hash);
};

const User = model("User", userSchema);

export default User