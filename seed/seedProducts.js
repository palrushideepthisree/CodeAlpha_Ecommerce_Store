// Run with: npm run seed
// Wipes the products collection and re-inserts the starter catalog.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const products = [
    {
        name: "Wireless Headphones",
        price: 2499,
        image: "images/headphones.jpg",
        description: "Experience premium sound quality with these wireless headphones. Features Bluetooth connectivity, active noise isolation, plush over-ear cushions, and up to 30 hours of battery life."
    },
    {
        name: "Smart Watch",
        price: 3999,
        image: "images/smartwatch.jpg",
        description: "Stay connected on the go with instant notifications, fitness tracking, heart rate monitoring, sleep tracking, and a bright always-on display."
    },
    {
        name: "Running Shoes",
        price: 1999,
        image: "images/shoes.jpg",
        description: "Lightweight and breathable running shoes designed for daily workouts, with cushioned support and all-day comfort."
    },
    {
        name: "Bluetooth Speaker",
        price: 1799,
        image: "images/speaker.jpg",
        description: "Portable Bluetooth speaker with powerful bass, crisp highs, splash resistance, and a 12-hour rechargeable battery."
    },
    {
        name: "Laptop",
        price: 140999,
        image: "images/laptop.jpg",
        description: "High-performance laptop suitable for programming, gaming, and professional work, with a fast processor and a vibrant display."
    },
    {
        name: "Gaming Mouse",
        price: 999,
        image: "images/mouse.jpg",
        description: "Ergonomic gaming mouse with RGB lighting, adjustable DPI up to 6400, and 6 programmable buttons."
    }
];

async function seed() {
    await connectDB();

    await Product.deleteMany({});
    const created = await Product.insertMany(products);

    console.log(`Seeded ${created.length} products:`);
    created.forEach(p => console.log(`  ${p._id}  ${p.name}`));

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
