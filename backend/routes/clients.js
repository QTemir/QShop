// backend/routes/clients.js
const express = require("express");
const Client = require("../models/Client");
const bcrypt = require("bcrypt");
const router = express.Router();

// GET /api/clients/all
router.get("/all", async (req, res) => {
    try {
        const clients = await Client.findAll({
            attributes: ["id", "shop", "domain", "email", "periodFrom", "periodTo", "payment", "logo", "visiblePassword"]
        });
        res.json(clients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/bySlug/:slug", async (req, res) => {
    try {
        const client = await Client.findOne({
            where: { slug: req.params.slug }
        });

        if (!client) return res.status(404).json({ message: "Not found" });

        res.json(client);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


// POST /api/clients/add
router.post("/add", async (req, res) => {
    try {
        const { shop, periodFrom, periodTo, payment, domain } = req.body;

        if (!shop || !periodFrom || !periodTo || !domain) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // Проверка уникальности domain
        const existing = await Client.findOne({ where: { domain } });
        if (existing) return res.status(400).json({ message: "Такой домен уже существует" });

        const email = `client@${domain}.com`;
        const password = Math.random().toString(36).slice(2, 9);
        const hash = await bcrypt.hash(password, 10);

        const slug = domain.toLowerCase().trim();

        const newClient = await Client.create({
            shop,
            domain,
            slug,                 // ← ДОБАВЛЕНО
            email,
            password: hash,
            visiblePassword: password,
            periodFrom: new Date(periodFrom),
            periodTo: new Date(periodTo),
            payment,
            logo: null
        });

        res.json({
            message: "Клиент успешно создан!",
            client: {
                id: newClient.id,
                shop: newClient.shop,
                domain: newClient.domain,
                slug: newClient.slug,
                email: newClient.email,
                periodFrom: newClient.periodFrom,
                periodTo: newClient.periodTo,
                payment: newClient.payment,
                logo: newClient.logo,
                visiblePassword: newClient.visiblePassword
            },
            login: email,
            password: password
        });
    } catch (err) {
        console.error("Ошибка добавления клиента:", err);
        res.status(500).json({ message: "Server error" });
    }
});



// DELETE /api/clients/:id
router.delete("/:id", async (req, res) => {
    try {
        await Client.destroy({ where: { id: req.params.id } });
        res.json({ message: "Клиент удалён" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/clients/login  (вход клиента)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const client = await Client.findOne({ where: { email } });
        if (!client) return res.status(200).json({ success: false, message: "Клиент не найден" });

        const isValid = await bcrypt.compare(password, client.password);
        if (!isValid) return res.status(200).json({ success: false, message: "Неверный пароль" });

        res.json({ success: true, site: client.domain, clientId: client.id, shop: client.shop });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET /api/clients/byDomain/:domain
router.get("/byDomain/:domain", async (req, res) => {
    try {
        const client = await Client.findOne({
            where: { domain: req.params.domain },
            attributes: ["id", "shop", "domain", "email", "periodFrom", "periodTo", "payment", "logo"]
        });
        if (!client) return res.status(404).json({ message: "Not found" });
        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/clients/update/:id  (обновить shop/logo и др.)
router.put("/update/:id", async (req, res) => {
    try {
        const { shop, logo, whatsapp } = req.body;
        const client = await Client.findByPk(req.params.id);
        if (!client) return res.status(404).json({ message: "Not found" });

        client.shop = shop ?? client.shop;
        client.logo = logo ?? client.logo;
        await client.save();

        res.json({ message: "Updated", client: { id: client.id, shop: client.shop, logo: client.logo } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
