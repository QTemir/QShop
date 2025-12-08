const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Product = sequelize.define("Product", {
    clientId: { type: DataTypes.INTEGER, allowNull: false },

    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },

    price: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: "KZT" },

    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    category: { type: DataTypes.STRING, allowNull: true },

    images: { type: DataTypes.TEXT, allowNull: true }, // JSON array
});

module.exports = Product;
