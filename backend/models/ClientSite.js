const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const ClientSite = sequelize.define("ClientSite", {
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    siteName: { type: DataTypes.STRING, allowNull: false },
    urlSlug: { type: DataTypes.STRING, unique: true },
    logo: { type: DataTypes.STRING },
});

module.exports = ClientSite;
