import { Request, Response } from "express";
import sequelize from "../utils/database";
import Chat from "../Models/chat";
import User from "../Models/User";
import Sequelize from "sequelize";
import Group from "../Models/group";
import { BlobServiceClient } from "@azure/storage-blob";
import createReadStream from "fs";

import dotenv from "dotenv";
dotenv.config();

interface CustomRequest extends Request {
  user?: any;
}

export const getAllChat = async (req: CustomRequest, res: Response) => {
  const currentUserId = req.user.id;
  const latestChatId = req.header("id") || 0;
  try {
    const userChats = (await Chat.findAll({
      where: {
        id: { [Sequelize.Op.gt]: latestChatId },
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      raw: true,
    })) as Array<any>;

    const allChats = userChats.map((chat) => ({
      id: chat.id,
      message: chat.message,
      messageType: chat.messageType,
      username: chat["user.name"],
      time: `${new Date(chat.createdAt).getHours()}:${new Date(
        chat.createdAt
      ).getMinutes()}`,
      isCurrentUser: chat.userId === currentUserId,
      currentUserName: req.user.name,
    }));
    console.log(allChats);
    res.status(200).json({ chats: allChats });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Interal Server Error" });
  }
};

export const storeChat = async (obj: any, socketUser: any) => {
  const t = await sequelize.transaction();
  const message = obj.message;
  const uuid = obj.id;
  const user = socketUser;
  try {
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
      raw: true,
    });
    if (group) {
      const chat = await Chat.create(
        {
          message: message,
          userId: user.id,
          groupId: group.id,
          messageType: obj.messageType,
        },
        { transaction: t }
      );
      await t.commit();
      return chat.dataValues;
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
};

export const storeFile = async (obj: any, socketUser: any) => {
  console.log("working");
  const t = await sequelize.transaction();
  const file: Buffer = obj.file;
  const uuid = obj.id;
  const user = socketUser;
  const fileUrl = await uploadFileToAzure(file, obj.fileName);
  try {
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
      raw: true,
    });
    if (group) {
      const chat = await Chat.create(
        {
          message: fileUrl as string,
          userId: user.id,
          groupId: group.id,
          messageType: obj.messageType,
        },
        { transaction: t }
      );
      await t.commit();
      console.log(chat.dataValues);
      return chat.dataValues;
    }
  } catch (err) {
    console.error(err);
  }
};

async function uploadFileToAzure(file: any, fileName: string) {
  console.log("Storing In Progress");
  const accountName = process.env.ACCOUNT_NAME as string;
  const sasToken = process.env.SAS_TOKEN as string;
  const containerName = process.env.CONTAINER_NAME as string;
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net/?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobClient = containerClient.getBlockBlobClient(fileName);
    await blobClient.uploadData(file);
    return blobClient.url;
  } catch (error: any) {
    console.error("Error uploading file", error);
    console.log("Failed to upload file");
  }
}
