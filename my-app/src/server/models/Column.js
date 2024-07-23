'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Column extends Model {
    static associate(models) {
      this.belongsToMany(models.Sheets, {
        through: 'SheetsColumn',
        foreignKey: 'columnId',
        otherKey: 'sheetId'
      });
    }
  }
  Column.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataType: {
      type: DataTypes.ENUM('text', 'select', 'number', 'date', 'datetime'),
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
    modelName: 'Column',
    timestamps: false,
  });
  return Column;
};
