// src/models/category.js
import { poolPromise, sql } from '../services/dbConnection.js';

class CategoryModel {
    async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Categories');
        return result.recordset;
    }

    async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Categories WHERE id = @id');
        return result.recordset[0];
    }

    async create(name, description = '') {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .query(`
                INSERT INTO Categories (name, description) 
                OUTPUT INSERTED.*
                VALUES (@name, @description)
            `);
        return result.recordset[0];
    }

    async update(id, name, description) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .query(`
                UPDATE Categories 
                SET name = @name, description = @description
                WHERE id = @id
            `);
    }

    async delete(id) {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Categories WHERE id = @id');
    }

    async getTopCategoriesByAvgPrice() {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT TOP 5
                c.id, c.name,
                AVG(p.price) AS avgPrice,
                COUNT(p.id) AS productCount
            FROM Categories c
            LEFT JOIN Products p ON p.category_id = c.id
            GROUP BY c.id, c.name
            ORDER BY avgPrice DESC
        `);
        return result.recordset;
    }

}

const categoryModel = new CategoryModel();
export default categoryModel;