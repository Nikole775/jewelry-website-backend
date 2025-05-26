import { faker } from '@faker-js/faker';
import { poolPromise, sql } from './src/services/dbConnection.js';

async function populateCategoriesAndProducts() {
    const pool = await poolPromise;

    // Insert 200000 categories
    for (let i = 0; i < 2000; i++) {
        const name = faker.commerce.department();
        const description = faker.lorem.sentence();

        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .query(`
        INSERT INTO Categories (name, description) VALUES (@name, @description)
      `);
    }

    // Fetch all category IDs to assign products
    const categoriesResult = await pool.request().query('SELECT id FROM Categories');
    const categoryIds = categoriesResult.recordset.map(c => c.id);

    // Insert 200000 products randomly linked to categories
    for (let i = 0; i < 2000; i++) {
        const name = faker.commerce.productName();
        const description = faker.commerce.productDescription();
        const style = faker.color.human();
        const price = parseFloat(faker.commerce.price());
        const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];

        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('style', sql.NVarChar, style)
            .input('price', sql.Decimal(10, 2), price)
            .input('category_id', sql.Int, categoryId)
            .query(`
        INSERT INTO Products (name, description, style, price, category_id)
        VALUES (@name, @description, @style, @price, @category_id)
      `);
    }

    console.log('Populated database with 200000 categories and 200000 products.');
}

populateCategoriesAndProducts().catch(console.error);
