// src/routes/categoryRoutes.js
// src/routes/categoryRoutes.js
import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authenticate.js';
import {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getTopCategoriesByAvgPrice
} from '../controller/categoryController.js'; // Note the `.js` extension

const router = express.Router();

router.get('/stats/top-by-price', getTopCategoriesByAvgPrice);

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', authenticateToken, authorizeRoles(1, 2), createCategory);
router.patch('/:id', authenticateToken, authorizeRoles(1, 2), updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles(1, 2), deleteCategory);

export default router;