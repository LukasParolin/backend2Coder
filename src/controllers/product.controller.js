const Product = require('../models/product.model');
const { AppError } = require('../middlewares/errorHandler');

// Obtener todos los productos
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    
    res.status(200).json({
      status: 'success',
      data: {
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un producto por ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(new AppError('Producto no encontrado', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock, category, image } = req.body;
    
    const newProduct = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      image
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto
const updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock, category, image } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, stock, category, image },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return next(new AppError('Producto no encontrado', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return next(new AppError('Producto no encontrado', 404));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 