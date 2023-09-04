import { Request, Response } from "express";
import User from "../Models/User";
import bcrypt from "bcrypt";
import sequelize from "../utils/database";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

async function generateAccessToken(id: number, name: string) {
  return jwt.sign({ userId: id, name: name }, "secretkey");
}

export const signUpUser = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const psk = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: psk,
    });

    console.log(user);
    res.status(200).json({ success: true, message: "Registered Successfully" });
    await t.commit();
  } catch (err: any) {
    console.log(err);
    await t.rollback();
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(500).json({ message: "User Already Exists" });
    }
  }
};

export const signInUser = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findAll({
      where: {
        email: email,
      },
    });

    if (user.length > 0) {
      const data = user[0].dataValues;
      bcrypt.compare(password, data.password, (err, result) => {
        if (result) {
          const token = generateAccessToken(data.id, data.name);
          res.status(200).json({ success: true, token: token, message : 'Authentication Successful' });
        } else if (!result) {
          res.status(401).json({ message: "Incorrect Password" , err : 'psk'});
        } else {
          throw new Error("An Error Occured");
        }
      });
    } else {
      res.status(404).json({ message: "User Not Found" , err : 'NF'});
    }
  } catch (err) {
    console.log(err);
  }
};
