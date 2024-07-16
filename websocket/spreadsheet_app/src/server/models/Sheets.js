'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sheets extends Model {
    static associate(models) {
      this.belongsToMany(models.Columns, {
        through: 'SheetsColumns',
        foreignKey: 'sheetId',
        otherKey: 'columnId'
      });
    }
  }
  Sheets.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Sheets',
    timestamps: false,
  });
  return Sheets;
};
