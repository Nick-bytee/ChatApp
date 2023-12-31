import { Request, Response } from "express"
import sequelize from "../utils/database"
import Chat from "../Models/chat"
import User from "../Models/User"
import  Sequelize, { where }  from "sequelize"
import Group from "../Models/group"

interface CustomRequest extends Request {
    user?: any,
}

export const getAllChat = async(req : CustomRequest, res: Response) => {
    const currentUserId = req.user.id
    const latestChatId = req.header('id') || 0
    try{
        const userChats = await Chat.findAll({
            where : {
                id : {[Sequelize.Op.gt] : latestChatId}
            },
            include : [{
                model : User,
                attributes  : ['name'],
            }],
             raw : true,
        }) as Array<any>;

        const allChats = userChats.map(chat => ({
            id : chat.id,
            message : chat.message,
            username : chat['user.name'],
            time : `${new Date(chat.createdAt).getHours()}:${new Date(chat.createdAt).getMinutes()}`,
            isCurrentUser : chat.userId === currentUserId
        }))
        res.status(200).json({chats : allChats})

    }catch(err){
        console.log(err)
        res.status(401).json({message: 'Interal Server Error'})
    }
}

export const storeChat = async(req : CustomRequest, res: Response)=> {
    const t = sequelize.transaction()
    const message = req.body.message
    const uuid = req.body.id
    const user = req.user
    try{
        const group = await Group.findOne({where : {
            uuid : uuid
        },raw : true})
        if(group){
            const chat = await Chat.create({
                message : message,
                userId : user.id,
                groupId : group.id
            })
        }
        res.status(200).json({success : true})
    }catch(err){
        console.log(err)
    }
}