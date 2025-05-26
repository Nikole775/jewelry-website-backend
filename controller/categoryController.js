// src/controller/categoryController.js
import categoryModel from '../models/category.js';
import { logAction } from '../utils/logAction.js';

export async function getAllCategories(req, res) {
    try {
        const categories = await categoryModel.getAll();
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getCategory(req, res) {
    try {
        const category = await categoryModel.getById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createCategory(req, res) {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const newCategory = await categoryModel.create(name, description);
        await logAction(req.user?.id || null, `Created category '${name}'`);
        res.status(201).json(newCategory);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateCategory(req, res) {
    try {
        const { name, description } = req.body;
        await categoryModel.update(req.params.id, name, description);
        await logAction(req.user?.id || null, `Updated category '${name}'`);
        res.status(204).end();
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteCategory(req, res) {
    try {
        await categoryModel.delete(req.params.id);
        await logAction(req.user?.id || null, `Deleted category ID ${req.params.id}`);
        res.status(204).end();
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTopCategoriesByAvgPrice(req, res) {
    try {
        const results = await categoryModel.getTopCategoriesByAvgPrice();
        res.json(results);
    } catch (err) {
        console.error('Error fetching top categories by avg price:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
