// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./sequelize");

// модели
const User = require("./models/User");
const Product = require("./models/Product");
const Client = require("./models/Client");

const app = express();
app.use(cors());
app.use(express.json());

// маршруты
app.use("/api/auth", require("./routes/auth"));          // логин/регистрация админа
app.use("/api/clients", require("./routes/clients"));    // клиенты
app.use("/api/products", require("./routes/products"));  // товары клиентов

// тест API
app.get("/", (req, res) => {
    res.json({ message: "Backend API is working 🚀" });
});

// запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);

    try {
        await sequelize.sync();
        console.log("Database synced ✔");
    } catch (err) {
        console.error("DB error:", err);
    }
});
app.use("/api/public", require("./routes/public"));
