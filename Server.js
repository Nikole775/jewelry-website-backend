/*const express = require('express');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 4000;

const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, ${req.params.productId}${ext});
    }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

let items = [
    { id: 1, name: "Elegant Ring", description: "A beautiful gold ring with diamonds.", style: "classic", category: "rings", price: 90, userAdded: true, video: "1.mp4" }, // 💡 added video here
    { id: 2, name: "Silver Bracelet", description: "A sleek silver bracelet for everyday wear.", style: "modern", category: "bracelets", price: 32, userAdded: false },
    { id: 3, name: "Pearl Necklace", description: "Classic pearl necklace with a modern twist.", style: "hippie", category: "necklace", price: 123, userAdded: false },
    { id: 4, name: "Ruby Earrings", description: "Red ruby earrings with intricate details.", style: "punk", category: "earrings", price: 15, userAdded: false },
    { id: 5, name: "Black Chain", description: "Thin body chain.", style: "grunge", category: "body chain", price: 182, userAdded: false },
    { id: 6, name: "Heavy chain", description: "Silver bulcky dog chain 30cm", style: "Y2K", category: "necklace", price: 200, userAdded: true },
    { id: 7, name: "Silver necklace cross Pendant", description: "stainless steel, 36cm", style: "grunge", category: "necklace", price: 10, userAdded: true, video: "1.mp4" },
    { id: 8, name: "Gold double cross Pendant", description: "material: gold, 36cm, 2 gold cress pendants", style: "Y2K", category: "necklace", price: 400, userAdded: false }

];

let nextId = items.length + 1;


const WebSocket = require('ws');
// Replace the current app.listen and wss creation with:
const server = app.listen(PORT, () => {
    console.log(Server running at http://localhost:${PORT});
});
const wss = new WebSocket.Server({ server });
// Background thread for generating new entities
function startEntityGenerator() {
    setInterval(() => {
        if (items.length >= 20) return; // Limit total items

        const styles = ["punk", "grunge", "Y2K", "hippie", "classic", "modern"];
        const categories = ["earrings", "rings", "necklace", "piercing", "bracelets", "body chain"];

        const newItem = {
            id: nextId++,
            name: Auto Item ${nextId},
            description: "Automatically generated item",
            style: styles[Math.floor(Math.random() * styles.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            price: Math.floor(Math.random() * 200) + 10,
            userAdded: false,
            createdAt: new Date().toISOString()
        };

        items.push(newItem);

        // Broadcast to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'NEW_AUTO_ITEM',
                    data: newItem
                }));
            }
        });

    }, 5000); // Generate every 5 seconds
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send initial data
    ws.send(JSON.stringify({
        type: 'INITIAL_DATA',
        data: items.filter(item => !item.userAdded)
    }));

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the generator when server starts
startEntityGenerator();

// Get all items
app.get('/items', (req, res) => {
    const { style, category, sort, sortPrice } = req.query;
    let filtered = [...items];

    if (style) filtered = filtered.filter(item => item.style === style);
    if (category) filtered = filtered.filter(item => item.category === category);
    if (sort === 'asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
    if (sortPrice === 'asc') filtered.sort((a, b) => a.price - b.price);
    if (sortPrice === 'desc') filtered.sort((a, b) => b.price - a.price);

    // Attach video URLs
    const updated = filtered.map(item => ({
        ...item,
        videoUrl: item.video ? http://localhost:${PORT}/api/products/${item.id}/video : null
    }));

    res.json(updated);
});

// Upload video
// Upload video
app.post("/api/products/:productId/video", upload.single("video"), (req, res) => {
    const id = parseInt(req.params.productId);
    const item = items.find(i => i.id === id);

    if (!item) return res.status(404).json({ error: "Item not found" });
    if (!req.file) return res.status(400).json({ error: "No video file provided" });

    const ext = path.extname(req.file.originalname);
    const videoFilename = ${id}${ext};

    // Update the item's video field
    item.video = videoFilename;

    res.json({
        message: "Video uploaded successfully",
        video: videoFilename,
        videoUrl: http://localhost:${PORT}/api/products/${id}/video
    });
});

// Download video
app.get("/api/products/:productId/video/download", (req, res) => {
    const id = req.params.productId;
    const videoFile = fs.readdirSync(uploadPath).find(f => f.startsWith(id));
    if (!videoFile) return res.status(404).json({ error: "Video not found" });

    const filePath = path.join(uploadPath, videoFile);
    res.download(filePath, videoFile);
});

// Serve video
app.get("/api/products/:productId/video", (req, res) => {
    const id = req.params.productId;
    const videoFile = fs.readdirSync(uploadPath).find(f => f.startsWith(id));
    if (!videoFile) return res.status(404).json({ error: "Video not found" });

    const filePath = path.join(uploadPath, videoFile);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': bytes ${start}-${end}/${fileSize},
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

// Add new item
app.post('/items', (req, res) => {
    const { name, description, style, category, price } = req.body;

    if (!name || !description || !style || !category || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newItem = {
        id: nextId++,
        name,
        description,
        style,
        category,
        price,
        userAdded: true,
        video: null
    };

    items.push(newItem);
    res.status(201).json(newItem);
});

// Edit item
app.patch('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const { name, description, style, category, price } = req.body;

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (style !== undefined) item.style = style;
    if (category !== undefined) item.category = category;
    if (price !== undefined) item.price = price;

    res.json(item);
});

// Delete item
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    items = items.filter(item => item.id !== id);
    res.status(204).send();
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(Server running at http://localhost:${PORT});
});  */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';

// Import routes
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productModel from './models/product.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const server = http.createServer(app);

// WebSocket setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// File upload setup
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.productId}${ext}`);
    }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// WebSocket events
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('welcome', { message: 'Welcome to the WebSocket server!' });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Video upload
app.post("/api/products/:productId/video", upload.single("video"), async (req, res) => {
    const id = parseInt(req.params.productId);
    if (!req.file) return res.status(400).json({ error: "No video file provided" });

    const ext = path.extname(req.file.originalname);
    const videoFilename = `${id}${ext}`;

    try {
        // Update product's video field in DB
        await productModel.updateVideo(id, videoFilename);

        res.json({
            message: "Video uploaded successfully",
            video: videoFilename,
            videoUrl: `http://localhost:${PORT}/uploads/${videoFilename}`
        });
    } catch (err) {
        console.error('Error updating product video:', err);
        res.status(500).json({ error: "Failed to update product video" });
    }
});

// Video streaming
app.get("/api/products/:productId/video", (req, res) => {
    const id = req.params.productId;
    const videoFile = fs.readdirSync(uploadPath).find(f => f.startsWith(id));
    if (!videoFile) return res.status(404).json({ error: "Video not found" });

    const filePath = path.join(uploadPath, videoFile);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

// Download video
app.get("/api/products/:productId/video/download", (req, res) => {
    const id = req.params.productId;
    const videoFile = fs.readdirSync(uploadPath).find(f => f.startsWith(id));
    if (!videoFile) return res.status(404).json({ error: "Video not found" });

    const filePath = path.join(uploadPath, videoFile);
    res.download(filePath, videoFile);
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export { app };


