const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Helper to parse images
const normalizeProduct = (p) => {
    const obj = p.toJSON();
    obj.images = obj.images ? JSON.parse(obj.images) : [];
    return obj;
};

// --------------------------
// CREATE PRODUCT
// --------------------------
router.post("/add", async (req, res) => {
    try {
        const { clientId, name, description, price, quantity, category, currency, images } = req.body;

        if (!clientId || !name)
            return res.status(400).json({ message: "Missing fields" });

        const p = await Product.create({
            clientId,
            name,
            description: description ?? "",
            price: Number(price || 0),
            quantity: Number(quantity || 0),
            category: category ?? null,
            currency: currency ?? "KZT",
            images: images ? JSON.stringify(images) : "[]",
        });

        res.json({ message: "Product created", product: normalizeProduct(p) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------------
// GET ALL PRODUCTS FOR CLIENT
// --------------------------
router.get("/byClient/:clientId", async (req, res) => {
    try {
        const products = await Product.findAll({ where: { clientId: req.params.clientId } });
        res.json(products.map(normalizeProduct));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------------
// GET ONE PRODUCT
// --------------------------
router.get("/:id", async (req, res) => {
    try {
        const p = await Product.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: "Not found" });
        res.json(normalizeProduct(p));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------------
// UPDATE PRODUCT
// --------------------------
router.put("/update/:id", async (req, res) => {
    try {
        const p = await Product.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: "Product not found" });

        await p.update({
            name: req.body.name ?? p.name,
            description: req.body.description ?? p.description,
            price: req.body.price ?? p.price,
            currency: req.body.currency ?? p.currency,
            quantity: req.body.quantity ?? p.quantity,
            category: req.body.category ?? p.category,
            images: req.body.images ? JSON.stringify(req.body.images) : p.images,
        });

        res.json({ message: "Updated", product: normalizeProduct(p) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------------
// DELETE PRODUCT
// --------------------------
router.delete("/delete/:id", async (req, res) => {
    try {
        const p = await Product.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: "Product not found" });

        await p.destroy();
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------------
// SELL / decrement quantity
// --------------------------
router.put("/sell/:id", async (req, res) => {
    try {
        const p = await Product.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: "Product not found" });

        if (p.quantity <= 0)
            return res.status(400).json({ message: "No stock" });

        p.quantity -= 1;
        await p.save();

        res.json({ message: "Sold", product: normalizeProduct(p) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
