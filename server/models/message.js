'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      message.belongsTo(models.user, {
        as: 'Recipient',
        foreignKey: {
          name: 'recipient'
        }
      })

      message.belongsTo(models.user, {
        as: 'Sender',
        foreignKey: {
          name: 'sender'
        }
      })
      
    }
  };
  message.init({
    sender: DataTypes.INTEGER,
    recipient: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'message',
  });
  return message;
};