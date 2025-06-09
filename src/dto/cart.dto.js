class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products.map(item => ({
      product: {
        id: item.product._id,
        title: item.product.title,
        price: item.product.price,
        thumbnail: item.product.thumbnail,
        stock: item.product.stock
      },
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }));
    this.total = this.calculateTotal();
    this.productCount = cart.products.length;
    this.itemCount = cart.products.reduce((total, item) => total + item.quantity, 0);
  }

  calculateTotal() {
    return this.products.reduce((total, item) => total + item.subtotal, 0);
  }

  static fromCart(cart) {
    return new CartDTO(cart);
  }
}

class CartSummaryDTO {
  constructor(cart) {
    this.id = cart._id;
    this.productCount = cart.products.length;
    this.itemCount = cart.products.reduce((total, item) => total + item.quantity, 0);
    this.total = cart.products.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  static fromCart(cart) {
    return new CartSummaryDTO(cart);
  }
}

module.exports = {
  CartDTO,
  CartSummaryDTO
}; 