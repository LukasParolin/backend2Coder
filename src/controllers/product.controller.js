const ProductRepository = require('../repositories/product.repository');
const Validators = require('../utils/validators');
const { AppError } = require('../middlewares/errorHandler');
const DatabaseCheck = require('../utils/database-check');
const DemoData = require('../utils/demo-data');

class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  // Obtener todos los productos
  async getAllProducts(req, res, next) {
    try {
      let products;
      let mode = 'database';
      
      if (!DatabaseCheck.isConnected()) {
        products = DemoData.getProducts();
        mode = 'demo';
      } else {
        products = await this.productRepository.getAllProducts();
      }
      
      res.status(200).json({
        status: 'success',
        mode,
        data: {
          products
        }
      });
    } catch (error) {
      // Si falla la base de datos, usar datos de demostración
      if (error.message.includes('Base de datos no disponible')) {
        const products = DemoData.getProducts();
        return res.status(200).json({
          status: 'success',
          mode: 'demo',
          message: 'Usando datos de demostración - Base de datos no disponible',
          data: {
            products
          }
        });
      }
      next(error);
    }
  }

  // Obtener un producto por ID
  async getProductById(req, res, next) {
    try {
      const product = await this.productRepository.getProductById(req.params.id);
      
      res.status(200).json({
        status: 'success',
        data: {
          product
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo producto (solo admin)
  async createProduct(req, res, next) {
    try {
      const productData = req.body;
      
      // Validar datos de entrada
      const validationErrors = Validators.validateProductData(productData);
      if (validationErrors.length > 0) {
        return next(new AppError(`Errores de validación: ${validationErrors.join(', ')}`, 400));
      }
      
      const newProduct = await this.productRepository.createProduct(productData);
      
      res.status(201).json({
        status: 'success',
        data: {
          product: newProduct
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar un producto (solo admin)
  async updateProduct(req, res, next) {
    try {
      const updateData = req.body;
      const updatedProduct = await this.productRepository.updateProduct(req.params.id, updateData);
      
      res.status(200).json({
        status: 'success',
        data: {
          product: updatedProduct
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar un producto (solo admin)
  async deleteProduct(req, res, next) {
    try {
      const result = await this.productRepository.deleteProduct(req.params.id);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener productos por categoría
  async getProductsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const products = await this.productRepository.getProductsByCategory(category);
      
      res.status(200).json({
        status: 'success',
        data: {
          products
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

// Crear instancia del controlador
const productController = new ProductController();

module.exports = {
  getAllProducts: productController.getAllProducts.bind(productController),
  getProductById: productController.getProductById.bind(productController),
  createProduct: productController.createProduct.bind(productController),
  updateProduct: productController.updateProduct.bind(productController),
  deleteProduct: productController.deleteProduct.bind(productController),
  getProductsByCategory: productController.getProductsByCategory.bind(productController)
}; 