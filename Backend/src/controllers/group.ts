import { Request, Response } from "express";
import User from "../Models/User";
import Group from "../Models/group";
import sequelize from "../utils/database";
import Chat from "../Models/chat";
import { v4 as uuidv4 } from "uuid";
import { Sequelize, where } from "sequelize";

interface customRequest extends Request {
  user?: any;
}

export const createGroup = async (req: customRequest, res: Response) => {
  const { groupName, groupDescription } = req.body;
  const uuid = uuidv4();
  const user = req.user;
  try {
    const group = await Group.create({
      name: groupName,
      description: groupDescription,
      uuid: uuid,
    });
    user.addGroup(group);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occurred" });
  }
};

export const getGroups = async (req: customRequest, res: Response) => {
  const user = req.user;
  try {
    const groups = await user.getGroups({
      attributes: ["name", "description", "uuid"],
      raw: true,
    });
    res.status(200).json({ groups: groups });
  } catch (err) {
    console.log(err);
    res.status(500).json("An Error Occured");
  }
};

export const storeChat = async (req: customRequest, res: Response) => {};

export const getGroupChat = async (req: customRequest, res: Response) => {
  const uuid = req.params.id;
  try {
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
    } as any);
    if (!group) {
      res.status(200).json("Err Occured");
      return;
    }
    const currentUser = req.user;
    const chats = (await group.getChats({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      raw: true,
    })) as Array<any>;

    const users = await group.getUsers({
      attributes: ["id", "name", "createdAt"],
      raw: true,
    });

    const allChats = chats.map((chat) => ({
      id: chat.id,
      message: chat.message,
      username: chat["user.name"],
      time: `${new Date(chat.createdAt).getHours()}:${new Date(
        chat.createdAt
      ).getMinutes()}`,
      isCurrentUser: chat.userId === currentUser.id,
    }));
    res.status(200).json({ users: users, chats: allChats, group: group });
  } catch (Err) {
    console.log(Err);
    res.status(500).json("Internal Server Error");
  }
};

export const getGroupInfo = async (req: customRequest, res: Response) => {
  const uuid = req.params.id
  try{
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
      raw : true,
    } as any);
    if (!group) {
      res.status(200).json("Err Occured");
      return;
    }
    res.status(200).json(group)
  }catch(err){
    console.log(err)
  }
};

export const updateGroupInfo = async(req : customRequest, res : Response) => {
    try{
      const group = await Group.update({
        name : req.body.name,
        description : req.body.description
      }, {where : {
        uuid : req.body.uuid
      }})
      res.status(200).json({message : 'success'})
    }catch(err){
      console.log(err)
      res.status(500).json({message : 'Internal Server Error'})
    }
}

export const joinGroup = async(req : customRequest, res : Response) => {
  const user = req.user
  try{
    const group = await Group.findOne({
      where : {
        uuid : req.body.uuid
      }
    })
    if(group) {
      const userGroup = await user.addGroup(group)
      if(userGroup){
        res.status(200).json({message : 'Group Joined'})
      }else{
        throw new Error('Already in the Group')
      }
    }else{
      res.status(500).json({message : 'Group Not Found'})
    }
  }catch(err : any){
    console.log(err)
    res.status(500).json({message : err.message})
  } 
}