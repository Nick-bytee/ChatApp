import { Request, Response } from "express";
import User from "../Models/User";
import Group from "../Models/group";
import { v4 as uuidv4 } from "uuid";
import userGroup from "../Models/usergroup";

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
    await user.addGroup(group);

    const usergroup = await userGroup.findOne({
      where: { userId: user.id, groupId: group.id },
    });
    if (usergroup) {
      await usergroup.update({ isAdmin: true });
    }
    console.log(usergroup);
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
      messageType: chat.messageType,
    }));
    res.status(200).json({ users: users, chats: allChats, group: group });
  } catch (Err) {
    console.log(Err);
    res.status(500).json("Internal Server Error");
  }
};

export const getGroupInfo = async (req: customRequest, res: Response) => {
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
    const users = (await group.getUsers({
      attributes: ["id", "name", "createdAt"],
      raw: true,
    })) as Array<any>;
    const userData = users.map((user) => ({
      id: user.id,
      name: user.name,
      isCurrentUser: req.user.id === user.id,
      isAdmin: user["userGroup.isAdmin"],
    }));
    res.status(200).json({ group, userData });
  } catch (err) {
    console.log(err);
  }
};

export const createAdmin = async (req: customRequest, res: Response) => {
  try {
    const uuid = req.body.uuid;
    const userId = req.body.userId;
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
    } as any);

    const usergroup = await userGroup.findOne({
      where: { userId: userId, groupId: group.id },
    });
    if (usergroup) {
      await usergroup.update({ isAdmin: true });
      res.status(200).json({ success: true });
    } else {
      throw new Error("Internal Server Error");
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

export const removeUser = async (req: customRequest, res: Response) => {
  const uuid = req.query.uuid;
  const userId = req.query.id;

  try {
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (group) {
    }
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (user && group) {
      // @ts-ignore
      user.removeGroup(group);
    }
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
};

export const searchUser = async (req: customRequest, res: Response) => {
  const uuid = req.body.uuid;
  const email = req.body.userData;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      const userData = {
        name: user.dataValues.name,
        email: user.dataValues.email,
      };
      // @ts-ignore
      // await user.addGroup(group)
      res.status(200).json({ data: user });
    } else {
      throw new Error("User Not Found!");
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const addUser = async (req: customRequest, res: Response) => {
  const email = req.body.email;
  const uuid = req.body.uuid;
  try {
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
    });
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      //@ts-ignore
      await user.addGroup(group);
      res.status(200).json({ message: "success" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateGroupInfo = async (req: customRequest, res: Response) => {
  try {
    await Group.update(
      {
        name: req.body.name,
        description: req.body.description,
      },
      {
        where: {
          uuid: req.body.uuid,
        },
      }
    );
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinGroup = async (req: customRequest, res: Response) => {
  const user = req.user;
  try {
    const group = await Group.findOne({
      where: {
        uuid: req.body.uuid,
      },
    });
    if (group) {
      const userGroup = await user.addGroup(group);
      if (userGroup) {
        res.status(200).json({ message: "Group Joined" });
      } else {
        throw new Error("Already in the Group");
      }
    } else {
      res.status(500).json({ message: "Group Not Found" });
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
