const models = require("../../services/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ApiError = require("../../services/error/api_error");

const generationJwt = (id, phone, role, code) => {
  return jwt.sign({ id, phone, role, code }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async connect(req, res, next) {
    try {
      const { phone, role } = req.body;
      const generation_code = crypto
        .randomInt(0, 1000000)
        .toString()
        .padStart(6, "0");
      if (!phone) {
        return next(ApiError.badRequest("Not a complete request"));
      }
      const validate = await models.users.findOne({ where: { phone: phone } });
      if (validate) {
        const token = generationJwt(
          validate.id,
          validate.phone,
          validate.role,
          generation_code
        );
        return res.status(200).json({ status: "Auth", token: token });
      } else {
        const token = generationJwt(null, phone, role, generation_code);
        console.log(generation_code);
        return res.status(201).json({ status: "Send code", token: token });
      }
    } catch (err) {
      return next(ApiError.badRequest("Error: " + err));
    }
  }

  async confirmation(req, res, next) {
    try {
      const { code_enter } = req.body;
      if (req.user.code === code_enter) {
        const user = await models.users.create({
          phone: req.user.phone,
          role: req.user.role,
        });
        const token = generationJwt(
          user.id,
          user.phone,
          user.role,
          crypto.randomInt(0, 1000000).toString().padStart(6, "0")
        );
        return res
          .status(201)
          .json({ status: "Successful code confirmation", token: token });
      } else {
        return res.status(409).json({ message: "Confirmation error" });
      }
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  async check(req, res, next) {
    try {
      const token = generationJwt(req.user.id, req.user.phone, req.user.role);
      return res.json({ token: token });
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  async upd_name(req, res, next) {
    try {
      const { name } = req.body;
      const user = await models.users.findOne({ where: { id: req.user.id } });
      if (!user) {
        return ApiError.badRequest("Request returned empty");
      }
      const upd_name = await models.users.update(
        { name: name },
        {
          where: { id: user.id },
        }
      );
      return res
        .status(200)
        .send({ status: "Name successfully edited", "new-name": name });
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  async upd_phone(req, res, next) {
    try {
      const { new_phone } = req.body;
      const user = await models.users.findOne({ where: { id: req.user.id } });
      if (!user) {
        return ApiError.badRequest("Request returned empty");
      }
      const upd_phone = await models.users.update(
        { phone: new_phone },
        {
          where: { id: user.id },
        }
      );
      return res
        .status(200)
        .send({ status: "Phone successfully edited", "new-phone": new_phone });
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  async upd_username(req, res, next) {
    try {
      const { username } = req.body;
      const user = await models.users.findOne({ where: { id: req.user.id } });
      if (!user) {
        return ApiError.badRequest("Request returned empty");
      }
      await models.users.update(
        { username: username },
        {
          where: { id: user.id },
        }
      );
      return res.status(200).send({
        status: "Username successfully edited",
        "new-username": username,
      });
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  async set_bio(req, res, next) {
    try {
      const { bio } = req.body;
      const user = await models.users.update(
        {
          bio: bio,
        },
        { where: { id: req.user.id } }
      );
      return res.status(201).send({ message: "Successfully changed" });
    } catch (err) {
      console.log(err);
    }
  }

  async get_bio(req, res, next) {
    try {
      const { bio } = req.body;
      const user = await models.users.findOne({
        where: { id: req.user.id },
      });
      return res.status(200).send({ bio: user.bio });
    } catch (err) {
      console.log(err);
    }
  }

  async get_info_user(req, res, next) {
    try {
      const user = await models.users.findOne({
        where: { id: req.user.id },
        // include: [models.details],
      });
      return res.status(200).send(user);
    } catch (err) {
      console.log(err);
    }
  }

  async set_cover(req, res, next) {
    try {
      const { cover } = req.body;
      const user = await models.users.update(
        {
          cover: cover,
        },
        { where: { id: req.user.id } }
      );
      return res.status(201).send({ message: "Successfully changed" });
    } catch (err) {
      console.log(err);
    }
  }

  async get_cover(req, res, next) {
    try {
      const { cover } = req.body;
      const user = await models.users.findOne({
        where: { id: req.user.id },
      });
      return res.status(200).send({ cover: user.cover });
    } catch (err) {
      console.log(err);
    }
  }

  async set_back_cover(req, res, next) {
    try {
      const { back_cover } = req.body;
      const user = await models.users.update(
        {
          back_cover: back_cover,
        },
        { where: { id: req.user.id } }
      );
      return res.status(201).send({ message: "Successfully changed" });
    } catch (err) {
      console.log(err);
    }
  }

  async get_back_cover(req, res, next) {
    try {
      const { back_cover } = req.body;
      const user = await models.users.findOne({
        where: { id: req.user.id },
      });
      return res.status(200).send({ back_cover: user.back_cover });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new UserController();
