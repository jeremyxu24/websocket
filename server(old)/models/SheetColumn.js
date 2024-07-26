'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SheetColumn extends Model {
    static associate(models) {
      // No associations needed in this intermediary model
    }
  }
  SheetColumn.init({
    sheetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sheets',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    columnId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Columns',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'SheetColumn',
    timestamps: false,
  });
  return SheetColumn;
};
