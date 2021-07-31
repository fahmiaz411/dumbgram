'use strict';
const {
  Model
} = require('sequelize');
const { use } = require('../src/routers');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.follow, {
        as: 'follower',
        foreignKey: {
          name: 'idFollowing'
        }
      })

      user.hasMany(models.follow, {
        as: 'following',
        foreignKey: {
          name: 'idFollower'
        }
      })      
      user.hasMany(models.feed, {
        as: 'posts',
        foreignKey: {
          name: 'idUser'
        }
      })


    }
  };
  user.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    p_image: DataTypes.STRING,
    p_posts: DataTypes.INTEGER,
    p_followers: DataTypes.INTEGER,
    p_following: DataTypes.INTEGER,
    bio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};