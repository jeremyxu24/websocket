'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Response extends Model {
    static associate(models) {
      this.belongsTo(models.SheetsColumns, {
        foreignKey: 'sheetColumnId',
        onDelete: 'CASCADE'
      });
    }
  }

  Response.init({
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
    modelName: 'Response',
    timestamps: false,
  });

  // Ensure the table is created if it doesn't exist
  Response.sync({ alter: true }).then(() => {
    console.log('Response table synced');
  }).catch(err => {
    console.error('Error syncing Response table:', err);
  });

  return Response;
};
