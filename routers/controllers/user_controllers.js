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
      const {phone, role} = req.body;
      if(!phone){
        return next(ApiError.badRequest("Not a complete request"));
      }
      const validate = await models.users.findOne({where: {phone:phone}});
      if (validate){
        const token = generationJwt(validate.id, validate.phone, validate.role, crypto.randomInt(0, 1000000).toString().padStart(6, "0"));
        return res.status(200).json({ status: "Auth", token: token });
      }
      const user = await models.users.create({
        phone: phone,
        role
      });
      const token = generationJwt(user.id, user.phone, user.role, crypto.randomInt(0, 1000000).toString().padStart(6, "0"));
      return res.status(201).json({ status: "Register", token:token });
    } catch (err) {return next(ApiError.badRequest("Error: " + err));}
  }

  async check(req, res, next) {
    try {
      const token = generationJwt(req.user.id, req.user.phone, req.user.role);
      return res.json({ token:token });
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  async upd_name(req, res, next) {
    try {
      const {name} = req.body;
      const user = await models.users.findOne({ where:  {id:req.user.id}  });
      if (!user) {
        return ApiError.badRequest("Request returned empty");
      }
      const upd_name = await models.users.update({name:name}, {
        where: { id: user.id },
      });
      return res.status(200).send({"status": "Name successfully edited", "new-name":name});
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  async upd_username(req, res, next) {
    try {
      const {username} = req.body;
      const user = await models.users.findOne({ where:  {id:req.user.id}  });
      if (!user) {
        return ApiError.badRequest("Request returned empty");
      }
      const upd_username = await models.users.update({username:username}, {
        where: { id: user.id },
      });
      return res.status(200).send({"status": "Username successfully edited", "new-username":username});
    } catch (err) {
      return ApiError.badRequest("Error: " + err);
    }
  }

  // async subscribe(req, res, next) {
  //   try {
  //     const { idolUsername, subUsername } = req.body;
  //     const idol = await models.users.findOne({ where: { username: idolUsername } });
  //     const subscriber = await models.users.findOne({ where: { username: subUsername } });
  //     idol.addSubscribe(subscriber);
  //     return res.status(200).send(idol);
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  // }

  // async unSubscribe(req, res, next) {
  //   try {
  //     const { idolUsername, subUsername } = req.body;
  //     const idol = await models.users.findOne({ where: { username: idolUsername } });
  //     const subscriber = await models.users.findOne({ where: { username: subUsername } });
  //     idol.addSubscribe(subscriber);
  //     return res.status(200).send(idol);
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  // }

  // async getSubscribers(req, res, next){
  //   try{
  //     const { idolUsername } = req.body;
  //     const idol = await models.users.findOne({ where: { username: idolUsername }});
  //     return res.status(200).send(await idol.getSubscribe());
  //   }catch(err){console.log(err);}
  // }

  // async getSubscriptions(req, res, next){
  //   try{
  //     const { subUsername } = req.body;
  //     const subscriber = await models.users.findOne({ where: { username: subUsername }});
  //     return res.status(200).send(await subscriber.getBackSubscribe());
  //   }catch(err){console.log(err);}
  // }

}

module.exports = new UserController();