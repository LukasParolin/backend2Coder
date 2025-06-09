const crypto = require('crypto');

class Generators {
  static generateProductCode() {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `PROD-${timestamp}-${random}`;
  }

  static generateTicketCode() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TICKET-${timestamp}-${random}`;
  }

  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateCartId() {
    return crypto.randomBytes(12).toString('hex');
  }

  static generateUserId() {
    return crypto.randomBytes(12).toString('hex');
  }
}

module.exports = Generators; 