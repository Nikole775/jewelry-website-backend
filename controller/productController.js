/*const productService = require('../services/productService');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.json(products);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = await productService.createProduct(req.body);
            res.status(201).json(newProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await productService.updateProduct(req.params.id, req.body);
            if (updatedProduct) {
                res.json(updatedProduct);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const success = await productService.deleteProduct(req.params.id);
            if (success) {
                res.json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new ProductController();*/

// controllers/productController.js
// src/controller/productController.js
import productModel from '../models/product.js';
import { logAction } from '../utils/logAction.js';

export async function getAllProducts(req, res) {
    try {
        const { style, category, sort, sortPrice } = req.query;
        let products = await productModel.getAll();

        // Apply filters
        if (style) {
            products = products.filter(p => p.style === style);
        }
        if (category) {
            products = products.filter(p => p.category_id == category);
        }

        // Apply sorting
        if (sort === 'asc') {
            products.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'desc') {
            products.sort((a, b) => b.name.localeCompare(a.name));
        }
        if (sortPrice === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortPrice === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }

        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getProduct(req, res) {
    try {
        const product = await productModel.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createProduct(req, res) {
    try {
        const { name, description, style, price, category_id } = req.body;
        if (!name || !description || !style || !price || !category_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newProduct = await productModel.create({
            name,
            description,
            style,
            price,
            category_id,
            user_added: true
        });

        await logAction(req.user?.id, `Created product '${name}'`);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateProduct(req, res) {
    try {
        const { name, description, style, price, category_id } = req.body;
        await productModel.update(req.params.id, {
            name,
            description,
            style,
            price,
            category_id
        });

        await logAction(req.user?.id, `Updated product ID ${req.params.id}`);
        res.status(204).end();
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteProduct(req, res) {
    try {
        await productModel.delete(req.params.id);
        await logAction(req.user?.id, `Deleted product ID ${req.params.id}`);
        res.status(204).end();
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}