'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accompanist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Accompanist.belongsTo(models.Guest);
    }
  };
  Accompanist.init({
    name: DataTypes.STRING,
    identifier: DataTypes.STRING,
    age: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Accompanist',
  });
  return Accompanist;
};