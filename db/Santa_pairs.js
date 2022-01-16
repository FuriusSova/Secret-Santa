const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Santa extends Model {}
class Receiver extends Model {}

Santa.init({
    santa_name : {
        type: DataTypes.STRING
    },
    santa_surname : {
        type: DataTypes.STRING
    },
    santa_id : {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: "santa",
    timestamps: false
});

Receiver.init({
    receiver_name : {
        type: DataTypes.STRING
    },
    receiver_surname : {
        type: DataTypes.STRING
    },
    receiver_wish : {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: "receiver",
    timestamps: false
});

Santa.hasOne(Receiver, {
    foreignKey : {
        type : DataTypes.UUID,
        allowNull : false
    }
});
Receiver.belongsTo(Santa);

module.exports = {
    santa : Santa,
    receiver : Receiver
};