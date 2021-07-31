'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      feed.belongsTo(models.user, {
        as: 'user',
        foreignKey: {
          name: 'idUser'
        }
      })

      feed.hasMany(models.comment, {
        as: 'Comments',
        foreignKey: {
          name: 'idFeed'
        }
      })
    }
  };
  feed.init({
    image: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    comments: DataTypes.INTEGER,
    shares: DataTypes.INTEGER,
    caption: DataTypes.TEXT,
    idUser: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'feed',
  });
  return feed;
};