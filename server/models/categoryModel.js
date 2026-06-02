const mongoose = require('mongoose');
const { nanoid } = require('nanoid/non-secure');

const categorySchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
           default: () => nanoid(10),
      unique: true,
      index: true
    },
    name: { type: String, required: true, trim: true,unique:true },
    doctors: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);

















