const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specie: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  adopted: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
