require("dotenv").config();


const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

connectDB();

app.use(express.json());
app.set("trust proxy", 1);

// Allow the frontend (served from a different origin/port) to send
// cookies with its requests.
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
        cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
}
    })
);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Fallback 404 for unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.listen(PORT, () => {
    console.log(`ShopEase API running on http://localhost:${PORT}`);
    });