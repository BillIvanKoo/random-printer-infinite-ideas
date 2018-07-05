'use strict';
module.exports = (sequelize, DataTypes) => {
  var prize = sequelize.define('prize', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  }, {});
  prize.associate = function(models) {
    // associations can be defined here
  };
  return prize;
};