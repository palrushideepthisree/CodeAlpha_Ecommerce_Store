const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

// POST /api/orders — place an order from the current cart
router.post("/", async (req, res) => {
    try {
        const { fullName, email, phone, address, paymentMethod } = req.body;

        if (!fullName || !email || !phone || !address || !paymentMethod) {
            return res.status(400).json({ message: "All shipping and payment fields are required." });
        }

       const cart = await Cart.findOne({ user: req.session.userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty." });
        }

        // Re-check stock at order time, in case it changed since items were added to the cart
        for (const item of cart.items) {
            if (item.qty > item.product.stock) {
                return res.status(400).json({
                    message: `${item.product.name} only has ${item.product.stock} in stock.`
                });
            }
        }

        const items = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty
        }));

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

        const order = await Order.create({
            user: req.session.userId,
            items,
            totalAmount,
            shippingInfo: { fullName, email, phone, address },
            paymentMethod
        });

        // Decrement stock for each purchased item
        for (const item of cart.items) {
            item.product.stock -= item.qty;
            await item.product.save();
        }

        // Empty the cart now that the order has been placed
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: "Failed to place order.", error: err.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.session.userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: "Invalid order id." });
    }
});

module.exports = router;
