class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.thumbnail = product.thumbnail;
    this.code = product.code;
    this.stock = product.stock;
    this.status = product.status;
    this.category = product.category;
  }

  static fromProduct(product) {
    return new ProductDTO(product);
  }

  static fromProducts(products) {
    return products.map(product => new ProductDTO(product));
  }
}

class ProductCreateDTO {
  constructor(productData) {
    this.title = productData.title;
    this.description = productData.description;
    this.price = productData.price;
    this.thumbnail = productData.thumbnail || [];
    this.code = productData.code;
    this.stock = productData.stock;
    this.status = productData.status !== undefined ? productData.status : true;
    this.category = productData.category;
  }
}

module.exports = {
  ProductDTO,
  ProductCreateDTO
}; 