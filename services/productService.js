/*const { poolPromise, sql } = require('../dbConnection');

class ProductService {
    async getAllProducts() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
        SELECT p.*, c.Name AS CategoryName 
        FROM Products p
        JOIN Categories c ON p.CategoryID = c.CategoryID
      `);
        return result.recordset;
    }

    async getProductById(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
        SELECT p.*, c.Name AS CategoryName 
        FROM Products p
        JOIN Categories c ON p.CategoryID = c.CategoryID
        WHERE p.ProductID = @id
      `);
        return result.recordset[0];
    }

    async createProduct(productData) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('name', sql.NVarChar, productData.name)
            .input('description', sql.NVarChar, productData.description)
            .input('style', sql.NVarChar, productData.style)
            .input('categoryId', sql.Int, productData.categoryId)
            .input('price', sql.Decimal(10, 2), productData.price)
            .input('userAdded', sql.Bit, productData.userAdded)
            .input('video', sql.NVarChar, productData.video)
            .query(`
        INSERT INTO Products (Name, Description, Style, CategoryID, Price, UserAdded, Video)
        OUTPUT INSERTED.*
        VALUES (@name, @description, @style, @categoryId, @price, @userAdded, @video)
      `);
        return result.recordset[0];
    }

    async updateProduct(id, productData) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, productData.name)
            .input('description', sql.NVarChar, productData.description)
            .input('style', sql.NVarChar, productData.style)
            .input('categoryId', sql.Int, productData.categoryId)
            .input('price', sql.Decimal(10, 2), productData.price)
            .input('userAdded', sql.Bit, productData.userAdded)
            .input('video', sql.NVarChar, productData.video)
            .query(`
        UPDATE Products
        SET 
          Name = @name,
          Description = @description,
          Style = @style,
          CategoryID = @categoryId,
          Price = @price,
          UserAdded = @userAdded,
          Video = @video
        WHERE ProductID = @id
        SELECT * FROM Products WHERE ProductID = @id
      `);
        return result.recordset[0];
    }

    async deleteProduct(id) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Products WHERE ProductID = @id');
        return result.rowsAffected[0] > 0;
    }
}

module.exports = new ProductService();*/

// services/productService.js
const path = require("path");
const fs = require("fs");

let items = [{ id: 1, name: "Elegant Ring", description: "A beautiful gold ring with diamonds.", style: "classic", category: "rings", price: 90, userAdded: true, video: "1.mp4" }, // 💡 added video here
    { id: 2, name: "Silver Bracelet", description: "A sleek silver bracelet for everyday wear.", style: "modern", category: "bracelets", price: 32, userAdded: false },
    { id: 3, name: "Pearl Necklace", description: "Classic pearl necklace with a modern twist.", style: "hippie", category: "necklace", price: 123, userAdded: false },
    { id: 4, name: "Ruby Earrings", description: "Red ruby earrings with intricate details.", style: "punk", category: "earrings", price: 15, userAdded: false },
    { id: 5, name: "Black Chain", description: "Thin body chain.", style: "grunge", category: "body chain", price: 182, userAdded: false },
    { id: 6, name: "Heavy chain", description: "Silver bulcky dog chain 30cm", style: "Y2K", category: "necklace", price: 200, userAdded: true },
    { id: 7, name: "Silver necklace cross Pendant", description: "stainless steel, 36cm", style: "grunge", category: "necklace", price: 10, userAdded: true, video: "1.mp4" },
    { id: 8, name: "Gold double cross Pendant", description: "material: gold, 36cm, 2 gold cress pendants", style: "Y2K", category: "necklace", price: 400, userAdded: false }
]; // paste your items array here
let nextId = items.length + 1;
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

function getAll(filters) {
    let filtered = [...items];
    const { style, category, sort, sortPrice } = filters;

    if (style) filtered = filtered.filter(item => item.style === style);
    if (category) filtered = filtered.filter(item => item.category === category);
    if (sort === 'asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
    if (sortPrice === 'asc') filtered.sort((a, b) => a.price - b.price);
    if (sortPrice === 'desc') filtered.sort((a, b) => b.price - a.price);

    return filtered.map(item => ({
        ...item,
        videoUrl: item.video ? `/api/products/${item.id}/video` : null
    }));
}

function add(product) {
    const newItem = {
        id: nextId++,
        ...product,
        userAdded: true,
        video: null
    };
    items.push(newItem);
    return newItem;
}

function update(id, updatedFields) {
    const item = items.find(i => i.id === id);
    if (!item) return null;
    Object.assign(item, updatedFields);
    return item;
}

function remove(id) {
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
}

function findById(id) {
    return items.find(i => i.id === id);
}

function getAllItems() {
    return items;
}

function addVideoToItem(id, filename) {
    const item = items.find(i => i.id === id);
    if (!item) return null;
    item.video = filename;
    return item;
}

module.exports = {
    getAll,
    add,
    update,
    remove,
    findById,
    addVideoToItem,
    getAllItems,
    uploadPath
};
