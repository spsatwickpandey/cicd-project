const express = require('express');

const router = express.Router();

// Mock product data for testing
const products = [
  {
    id: 1,
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'Electronics',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Smartphone',
    description: 'Latest smartphone model',
    price: 699.99,
    category: 'Electronics',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Coffee Mug',
    description: 'Ceramic coffee mug',
    price: 12.99,
    category: 'Kitchen',
    inStock: false,
    createdAt: new Date().toISOString(),
  },
];

// Get all products
router.get('/', (req, res) => {
  try {
    const { category, inStock, sortBy = 'name', order = 'asc' } = req.query;

    let filteredProducts = [...products];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase()),
      );
    }

    // Filter by stock status
    if (inStock !== undefined) {
      const stockFilter = inStock === 'true';
      filteredProducts = filteredProducts.filter((p) => p.inStock === stockFilter);
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    res.status(200).json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
});

// Create new product
router.post('/', (req, res) => {
  try {
    const { name, description, price, category, inStock = true } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, description, price, and category are required',
      });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a positive number',
      });
    }

    const newProduct = {
      id: products.length + 1,
      name,
      description,
      price,
      category,
      inStock,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
    });
  }
});

// Update product
router.put('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, category, inStock } = req.body;

    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a positive number',
      });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price }),
      ...(category && { category }),
      ...(inStock !== undefined && { inStock }),
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: products[productIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
    });
  }
});

// Delete product
router.delete('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
    });
  }
});

// Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const categoryProducts = products.filter((p) =>
      p.category.toLowerCase() === category.toLowerCase(),
    );

    res.status(200).json({
      success: true,
      data: categoryProducts,
      count: categoryProducts.length,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category',
    });
  }
});

module.exports = router;
