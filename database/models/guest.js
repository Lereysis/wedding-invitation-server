'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Guest.belongsTo(models.User);
    }
  };
  Guest.init({
    name: DataTypes.STRING,
    numberPhone: DataTypes.STRING,
    numberGuest: DataTypes.STRING,
    slug: DataTypes.STRING,
    messageCustomize: DataTypes.TEXT,
    partyMates: DataTypes.TEXT,
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: null,
    },
  }, {
    sequelize,
    modelName: 'Guest',
  });
  return Guest;
};