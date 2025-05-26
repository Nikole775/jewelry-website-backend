const { poolPromise, sql } = require('../dbConnection');

class CategoryService {
    async getAllCategories() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Categories ORDER BY Name');
        return result.recordset;
    }

    async getCategoryById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Categories WHERE CategoryID = @id');
        return result.recordset[0];
    }

    async createCategory(name) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .query(`
        INSERT INTO Categories (Name)
        OUTPUT INSERTED.*
        VALUES (@name)
      `);
        return result.recordset[0];
    }

    async updateCategory(id, newName) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, newName)
            .query(`
        UPDATE Categories
        SET Name = @name
        WHERE CategoryID = @id
        SELECT * FROM Categories WHERE CategoryID = @id
      `);
        return result.recordset[0];
    }

    async deleteCategory(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Categories WHERE CategoryID = @id');
        return result.rowsAffected[0] > 0;
    }

    async getProductsByCategory(categoryId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .query(`
        SELECT p.* 
        FROM Products p
        WHERE p.CategoryID = @categoryId
      `);
        return result.recordset;
    }
}

module.exports = new CategoryService();