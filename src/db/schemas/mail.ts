import { Schema, model } from 'mongoose'

const mailSchema = new Schema({
  
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Request"
  },
  messageList :[
      {
      name: {
        type: String,
      },
      ownerId: {
        required: true,
        type: String,
      },
      message: {
        required: true,
        type: String,
      },
      read: {
        type: Boolean,
      }
    }
  ]
});

const Equipment = model("Mail", mailSchema);

export default Equipment
