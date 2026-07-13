const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products 
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        const filter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const products = await Product.find(filter).sort({ createdAt: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch products.", error: err.message });
    }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.json(product); //products
    } catch (err) {
        res.status(400).json({ message: "Invalid product id." });
    }
});

// POST /api/products 
router.post("/", async (req, res) => {
    try {
        const { name, price, image, description, stock } = req.body;

        if (!name || price === undefined || !image) {
            return res.status(400).json({ message: "name, price, and image are required." });
        }

        const product = await Product.create({ name, price, image, description, stock });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: "Failed to create product.", error: err.message });
    }
});

// PUT /api/products/:id — update
router.put("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json(product);
    } catch (err) {
        res.status(400).json({ message: "Failed to update product.", error: err.message });
    }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.json({ message: "Product deleted." });
    } catch (err) {
        res.status(400).json({ message: "Failed to delete product.", error: err.message });
    }
});

module.exports = router;
