'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class share extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      share.belongsTo(models.feed, {
        as: 'post',
        foreignKey: {
          name: 'idFeed'
        }
      })

      share.belongsTo(models.user, {
        as: 'who',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  };
  share.init({
    idFeed: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'share',
  });
  return share;
};