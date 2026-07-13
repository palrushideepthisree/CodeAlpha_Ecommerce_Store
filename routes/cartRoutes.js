const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// All cart routes require a logged-in user
router.use(requireAuth);

async function getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
        cart = await cart.populate("items.product");
    }
    return cart;
}

// GET /api/cart
router.get("/", async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.session.userId);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart.", error: err.message });
    }
});

// POST /api/cart — add an item { productId, qty }
router.post("/", async (req, res) => {
    try {
       const { productId, qty = 1 } = req.body;

        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({ message: "qty must be a positive integer." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const cart = await getOrCreateCart(req.session.userId);
        const existing = cart.items.find(item => item.product._id.toString() === productId);
        const requestedTotal = (existing ? existing.qty : 0) + qty;

        if (requestedTotal > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} in stock.`,
                available: product.stock
            });
        }

        if (existing) {
            existing.qty += qty;
        } else {
            cart.items.push({ product: productId, qty });
        }

        await cart.save();
        await cart.populate("items.product");

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to add item to cart.", error: err.message });
    }
});

// PUT /api/cart/:productId — set quantity
router.put("/:productId", async (req, res) => {
    try {
       const { qty } = req.body;

        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({ message: "qty must be a positive integer." });
        }

        const cart = await getOrCreateCart(req.session.userId);
        const item = cart.items.find(item => item.product._id.toString() === req.params.productId);

        if (!item) {
            return res.status(404).json({ message: "Item not in cart." });
        }

        if (qty > item.product.stock) {
            return res.status(400).json({
                message: `Only ${item.product.stock} in stock.`,
                available: item.product.stock
            });
        }

        item.qty = qty;
        await cart.save();
        await cart.populate("items.product");

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to update cart item.", error: err.message });
    }
});

// DELETE /api/cart/:productId — remove one item
router.delete("/:productId", async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.session.userId);
        cart.items = cart.items.filter(
            item => item.product._id.toString() !== req.params.productId
        );

        await cart.save();
        await cart.populate("items.product");

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to remove cart item.", error: err.message });
    }
});

// DELETE /api/cart — clear the whole cart
router.delete("/", async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.session.userId);
        cart.items = [];
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Failed to clear cart.", error: err.message });
    }
});

module.exports = router;
