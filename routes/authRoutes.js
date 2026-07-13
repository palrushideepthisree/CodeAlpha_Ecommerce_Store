const express = require("express");
const User = require("../models/User");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are all required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const user = await User.create({ name, email: email.toLowerCase(), password });

        // Log the user in immediately after registering
        req.session.userId = user._id;

        res.status(201).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Registration failed.", error: err.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        req.session.userId = user._id;

        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Login failed.", error: err.message });
    }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed." });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out." });
    });
});

// GET /api/auth/me — who is currently logged in, if anyone
router.get("/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(200).json({ user: null });
    }

    try {
        const user = await User.findById(req.session.userId);
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch current user.", error: err.message });
    }
});

module.exports = router;
