// backend/models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Product = sequelize.define("Product", {
    clientId: { type: DataTypes.INTEGER, allowNull: false }, // связь с Client.id
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    images: { type: DataTypes.TEXT, allowNull: true }, // JSON string array of dataURLs / URLs
});

module.exports = Product;
