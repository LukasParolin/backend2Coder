const ProductDAO = require('../dao/product.dao');
const { ProductDTO, ProductCreateDTO } = require('../dto/product.dto');
const { AppError } = require('../middlewares/errorHandler');

class ProductRepository {
  constructor() {
    this.productDAO = new ProductDAO();
  }

  async getAllProducts() {
    const products = await this.productDAO.findAll();
    return ProductDTO.fromProducts(products);
  }

  async getProductById(id) {
    const product = await this.productDAO.findById(id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    return ProductDTO.fromProduct(product);
  }

  async createProduct(productData) {
    const productCreateDTO = new ProductCreateDTO(productData);
    
    // Verificar si ya existe un producto con el mismo código
    const existingProduct = await this.productDAO.findByCode(productCreateDTO.code);
    if (existingProduct) {
      throw new AppError('Ya existe un producto con ese código', 400);
    }

    const newProduct = await this.productDAO.create(productCreateDTO);
    return ProductDTO.fromProduct(newProduct);
  }

  async updateProduct(id, updateData) {
    const product = await this.productDAO.findById(id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    // Si se está actualizando el código, verificar que no exista
    if (updateData.code && updateData.code !== product.code) {
      const existingProduct = await this.productDAO.findByCode(updateData.code);
      if (existingProduct) {
        throw new AppError('Ya existe un producto con ese código', 400);
      }
    }

    const updatedProduct = await this.productDAO.updateById(id, updateData);
    return ProductDTO.fromProduct(updatedProduct);
  }

  async deleteProduct(id) {
    const product = await this.productDAO.findById(id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    await this.productDAO.deleteById(id);
    return { message: 'Producto eliminado correctamente' };
  }

  async updateProductStock(id, quantity) {
    const product = await this.productDAO.findById(id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Stock insuficiente', 400);
    }

    const newStock = product.stock - quantity;
    const updatedProduct = await this.productDAO.updateStock(id, newStock);
    return ProductDTO.fromProduct(updatedProduct);
  }

  async getProductsByCategory(category) {
    const products = await this.productDAO.findByCategory(category);
    return ProductDTO.fromProducts(products);
  }
}

module.exports = ProductRepository; 