'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sheet extends Model {
    static associate(models) {
      // Define the association with Directory
      this.belongsTo(models.Directory, { foreignKey: 'directoryId', as: 'Directory' });
      this.belongsToMany(models.Columns, {
        through: 'SheetColumns',
        foreignKey: 'sheetId',
        otherKey: 'columnId'
      });
    }
  }
  Sheet.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    directoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Directory', 
        key: 'id'
      },
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Sheet',
    timestamps: false,
  });
  return Sheet;
};
