const mongoose = require('mongoose');

class DatabaseCheck {
  static isConnected() {
    return mongoose.connection.readyState === 1;
  }

  static getConnectionStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState] || 'unknown';
  }

  static throwIfNotConnected(operation = 'operación de base de datos') {
    if (!this.isConnected()) {
      throw new Error(`Base de datos no disponible. No se puede realizar: ${operation}. Estado: ${this.getConnectionStatus()}`);
    }
  }
}

module.exports = DatabaseCheck; 