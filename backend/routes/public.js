const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// GET /api/public/client/bySiteName/:siteName
router.get("/client/bySiteName/:siteName", async (req, res) => {
    try {
        const c = await Client.findOne({
            where: { siteName: req.params.siteName }
        });

        if (!c) return res.status(404).json({ message: "Client not found" });

        res.json({
            id: c.id,
            name: c.name,
            whatsapp: c.whatsapp,
            instagram: c.instagram,
            theme: c.theme,
            logo: c.logo,
            siteName: c.siteName
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
