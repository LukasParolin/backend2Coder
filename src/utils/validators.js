class Validators {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // Mínimo 6 caracteres
    return password && password.length >= 6;
  }

  static validateAge(age) {
    return Number.isInteger(age) && age >= 18 && age <= 120;
  }

  static validatePrice(price) {
    return typeof price === 'number' && price >= 0;
  }

  static validateStock(stock) {
    return Number.isInteger(stock) && stock >= 0;
  }

  static validateQuantity(quantity) {
    return Number.isInteger(quantity) && quantity > 0;
  }

  static validateProductCode(code) {
    return typeof code === 'string' && code.trim().length >= 3;
  }

  static validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      throw new Error(`${fieldName} es requerido`);
    }
    return true;
  }

  static validateUserData(userData) {
    const errors = [];

    if (!userData.first_name || !userData.first_name.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!userData.last_name || !userData.last_name.trim()) {
      errors.push('El apellido es requerido');
    }

    if (!userData.email || !this.validateEmail(userData.email)) {
      errors.push('Email válido es requerido');
    }

    if (!userData.password || !this.validatePassword(userData.password)) {
      errors.push('Contraseña debe tener al menos 6 caracteres');
    }

    if (!userData.age || !this.validateAge(userData.age)) {
      errors.push('Edad debe ser un número entre 18 y 120');
    }

    return errors;
  }

  static validateProductData(productData) {
    const errors = [];

    if (!productData.title || !productData.title.trim()) {
      errors.push('El título es requerido');
    }

    if (!productData.description || !productData.description.trim()) {
      errors.push('La descripción es requerida');
    }

    if (!productData.price || !this.validatePrice(productData.price)) {
      errors.push('Precio válido es requerido');
    }

    if (productData.stock !== undefined && !this.validateStock(productData.stock)) {
      errors.push('Stock debe ser un número entero mayor o igual a 0');
    }

    if (!productData.category || !productData.category.trim()) {
      errors.push('La categoría es requerida');
    }

    if (!productData.code || !this.validateProductCode(productData.code)) {
      errors.push('Código de producto válido es requerido');
    }

    return errors;
  }
}

module.exports = Validators; 