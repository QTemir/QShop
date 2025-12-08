// backend/models/Client.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Client = sequelize.define("Client", {
    shop: { type: DataTypes.STRING, allowNull: false },
    domain: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },        // хэш
    visiblePassword: { type: DataTypes.STRING, allowNull: true },  // временный plaintext (для учебного демо)
    logo: { type: DataTypes.STRING, allowNull: true },            // url / dataURL
    periodFrom: { type: DataTypes.DATE, allowNull: false },
    periodTo: { type: DataTypes.DATE, allowNull: false },
    payment: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },

});

module.exports = Client;

