const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class User extends Model {}

User.init({
    name : {
        type: DataTypes.STRING
    },
    surname : {
        type: DataTypes.STRING
    },
    wish : {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: "user",
    timestamps: false
})

module.exports = User;