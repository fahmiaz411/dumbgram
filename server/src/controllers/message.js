const { message, user, sequelize } = require("../../models");
const joi = require("joi");
const { Op, QueryTypes } = require("sequelize");

exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { idUser } = req;
    const messages = req.body.message;

    if (id == idUser) {
      return res.send({
        status: "failed",
        message: "Send message to your self ?!",
      });
    }

    const schema = joi
      .object({
        message: joi.string().required(),
      })
      .validate(req.body);

    const { error } = schema;

    if (error) {
      return res.send({
        status: "failed",
        message: error.details[0].message,
      });
    }

    const check = await user.findOne({
      where: {
        id,
      },
    });

    if (!check) {
      return res.send({
        status: "failed",
        message: `User with id ${id} not found`,
      });
    }

    const data = await message.create({
      sender: idUser,
      recipient: id,
      message: messages,
    });

    const dataUser = await message.findOne({
      where: {
        id: data.id,
      },
      include: {
        model: user,
        as: "Recipient",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "password",
            "email",
            "bio",
            "token",
          ],
        },
      },
      attributes: {
        exclude: ["sender", "recipient", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        Message: dataUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.messageWithId = async (req, res) => {
  try {
    const { username } = req.params;
    const { idUser } = req;

    const check = await user.findOne({
      where: {
        username,
      },
    });

    if (!check) {
      return res.send({
        status: "failed",
        message: `User with username ${username} not found`,
      });
    }

    const messages = await message.findAll({
      where: {
        [Op.or]: [
          {
            sender: check.id,
            recipient: idUser,
          },
          {
            sender: idUser,
            recipient: check.id,
          },
        ],
      },
      include: {
        model: user,
        as: "Sender",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "password",
            "email",
            "bio",
            "token",
          ],
        },
      },
      attributes: {
        exclude: ["sender", "recipient"],
      },
    });

    res.send({
      status: "success",
      data: {
        me: idUser,
        Message: messages,
      },
    });
  } catch (err) {
    console.log(err);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.messageUsers = async (req, res) => {
  try {
    const { idUser } = req;
    const last = await sequelize.query(
      "SELECT MAX(id) as last FROM messages GROUP BY sender",
      { type: QueryTypes.SELECT }
    );
    const ress = last.map((l) => l.last);

    console.log(ress);

    const result = await message.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id: {
          [Op.in]: ress,
        },
        recipient: idUser,
      },
      include: {
        model: user,
        as: "Recipient",
      },
    });

    // const seq = await sequelize.query('SELECT MAX(id) as last FROM messages GROUP BY sender', {type: DataTypes.SELECT})

    // const mapp = seq[0].map((data) => data.last)

    // console.log(mapp)

    // const data = await message.findAll({
    //     where: {
    //         id: {
    //             [Op.in]: mapp
    //         },
    //         recipient: idUser
    //     },
    //     include: {
    //         model: user,
    //         as: 'Sender'
    //     },
    // })

    const userData = await user.findOne({
      where: {
        id: idUser,
      },
    });

    const data = await message.findAll({
      where: {
        sender: idUser,
      },
      include: {
        model: user,
        as: "Recipient",
      },
      group: ["message.recipient"],
      order: [["updatedAt", "DESC"]],
    });

    res.send({
      status: "success",
      data: {
        user: userData,
        chat: data,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
