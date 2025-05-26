import { poolPromise, sql } from '../services/dbConnection.js';

class UserModel {
    async createUser(email, username, password, roleId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('roleId', sql.Int, roleId)
            .query(`
                INSERT INTO Users (email,username, password, roleId)
                OUTPUT INSERTED.*
                VALUES (@email, @username, @password, @roleId)
            `);
        return result.recordset[0];
    }

    async findByUsername(username) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');
        return result.recordset[0];
    }

    async getById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Users WHERE id = @id');
        return result.recordset[0];
    }

    async findByEmail(email) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');
        return result.recordset[0];
    }

}

export default new UserModel();
