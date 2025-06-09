const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido']
  },
  age: {
    type: Number,
    required: true,
    min: [18, 'La edad mínima debe ser 18 años']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  previousPassword: {
    type: String,
    select: false
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Método para validar la contraseña
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para verificar si la nueva contraseña es igual a la anterior
userSchema.methods.isSamePassword = async function(password) {
  if (!this.previousPassword) return false;
  return await bcrypt.compare(password, this.previousPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 