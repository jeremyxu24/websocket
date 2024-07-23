'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Directory extends Model {
    static associate(models) {
      // Self-referential association
      this.belongsTo(models.Directory, { as: 'Parent', foreignKey: 'parentId' });
      this.hasMany(models.Directory, { as: 'Children', foreignKey: 'parentId' });
    }
  }
  Directory.init({
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('directory', 'sheet'),
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Directory', // Name of the table
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Directory',
    timestamps: false,
  });
  return Directory;
};
