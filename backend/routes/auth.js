const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Client = require("../models/Client");

// регистрация (только админов)
router.post("/register", async (req, res) => {
    const { email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash, role });
    res.json({ message: "User created" });
});

// логин для всех (админы + клиенты)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // сначала проверяем User (админ)
    const user = await User.findOne({ where: { email } });
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign({ id: user.id, role: user.role }, "secret_value");
        return res.json({ token, role: user.role });
    }

    // если не админ — проверяем Client
    const client = await Client.findOne({ where: { email } });
    if (!client) return res.status(400).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, client.password);
    if (!isValid) return res.status(400).json({ error: "Wrong password" });

    // возвращаем success + site для фронта
    res.json({ role: "client", clientSiteName: client.domain });
});

module.exports = router;
