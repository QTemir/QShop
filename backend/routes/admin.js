const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ClientSite = require("../models/ClientSite");

router.post("/create-client", async (req, res) => {
    const { email, password, shop_name } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, role: "client" });

    const slug = shop_name.toLowerCase().replace(/\s+/g, "");

    await ClientSite.create({
        ownerId: user.id,
        siteName: shop_name,
        urlSlug: slug
    });

    res.json({
        message: "Client created",
        loginData: {
            email,
            password,
            shop_link: `http://localhost:3000/shop/${slug}`
        }
    });
});

module.exports = router;
