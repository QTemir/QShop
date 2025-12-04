// backend/routes/products.js
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// POST /api/products/add
router.post("/add", async (req, res) => {
    try {
        const { clientId, name, description, price, quantity, images } = req.body;
        if (!clientId || !name) return res.status(400).json({ message: "Missing fields" });

        const p = await Product.create({
            clientId,
            name,
            description: description ?? "",
            price: Number(price || 0),
            quantity: Number(quantity || 0),
            images: images ? JSON.stringify(images) : null
        });

        res.json({ message: "Product created", product: p });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/products/byClient/:clientId
router.get("/byClient/:clientId", async (req, res) => {
    try {
        const products = await Product.findAll({ where: { clientId: req.params.clientId } });
        // parse images
        const out = products.map(p => {
            const obj = p.toJSON();
            obj.images = obj.images ? JSON.parse(obj.images) : [];
            return obj;
        });
        res.json(out);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
