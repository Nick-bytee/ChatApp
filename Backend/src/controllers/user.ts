import { Request, Response } from "express";
import User from "../Models/User";
import bcrypt from "bcrypt";
import sequelize from "../utils/database";

export const signUpUser = async (req: Request, res: Response) => {
    const t = await sequelize.transaction()
  try {
    const psk = await bcrypt.hash(req.body.password,10)
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: psk,
    });
    
    console.log(user);
    res.status(200).json({ success: true , message : "Registered Successfully"});
    await t.commit()
  } catch (err: any) {
    console.log(err);
    await t.rollback()
    if(err.name === "SequelizeUniqueConstraintError"){
        res.status(500).json({message : "User Already Exists"})
    }
  }
};
