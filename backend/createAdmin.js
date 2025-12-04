const bcrypt = require("bcrypt");
const User = require("./models/User");
const sequelize = require("./sequelize");

(async () => {
    try {
        await sequelize.sync();

        const email = "admin@qsh.com";
        const password = "123456"; // можно поменять
        const role = "admin";

        const hash = await bcrypt.hash(password, 10);

        await User.create({ email, password: hash, role });

        console.log("Admin user created!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
