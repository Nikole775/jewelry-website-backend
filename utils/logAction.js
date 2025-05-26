// src/utils/logAction.js
import { poolPromise, sql } from '../services/dbConnection.js';

export async function logAction(userId, action) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('user_id', sql.Int, userId)
            .input('action', sql.NVarChar, action)
            .query('INSERT INTO UserLogs (user_id, action) VALUES (@user_id, @action)');
    } catch (err) {
        console.error('Error logging action:', err);
    }
}
