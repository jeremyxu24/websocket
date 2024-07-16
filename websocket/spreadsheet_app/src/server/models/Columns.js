'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Columns extends Model {
    static associate(models) {
      this.belongsToMany(models.Sheets, {
        through: 'SheetsColumns',
        foreignKey: 'columnId',
        otherKey: 'sheetId'
      });
    }
  }
  Columns.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataType: {
      type: DataTypes.ENUM('text', 'select', 'number'),
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    minWidth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Columns',
    timestamps: false,
  });
  return Columns;
};
