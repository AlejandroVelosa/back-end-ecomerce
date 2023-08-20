const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Purchase = sequelize.define("purchase", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // productId
  //UserId
});

module.exports = Purchase;
