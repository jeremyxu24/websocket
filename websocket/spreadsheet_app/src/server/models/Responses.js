'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Responses extends Model {
    static associate(models) {
      this.belongsTo(models.SheetsColumns, {
        foreignKey: 'sheetColumnId',
        onDelete: 'CASCADE'
      });
    }
  }

  Responses.init({
    response: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rowId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sheetColumnId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SheetsColumns',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'Responses',
    timestamps: false,
  });

  // Ensure the table is created if it doesn't exist
  Responses.sync({ alter: true }).then(() => {
    console.log('Responses table synced');
  }).catch(err => {
    console.error('Error syncing Responses table:', err);
  });

  return Responses;
};
