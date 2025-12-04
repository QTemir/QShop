// backend/db.js
const mongoose = require("mongoose");

const uri = "mongodb+srv://Temir_qsh_admin:Tiger_18032005@@qshop.tktjrqs.mongodb.net/?appName=QShop";

const connectDB = async () => {
    try {
        await mongoose.connect(uri); // больше никаких устаревших опций
        console.log("MongoDB connected ✅");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
