import { Request, Response } from "express"
import sequelize from "../utils/database"
import Chat from "../Models/chat"
import User from "../Models/User"

interface CustomRequest extends Request {
    user?: any
}

export const getAllChat = async(req : Request, res: Response) => {
    try{
        const chat = await Chat.findAll({
            include : [{
                model : User,
                attributes : ['name']
            }],
            raw : true,
        })
        console.log(chat)
        res.status(200).json({success : true})
    }catch(err){
        console.log(err)
    }

}

export const storeChat = async(req : CustomRequest, res: Response)=> {
    const t = sequelize.transaction()
    const message = req.body.message
    try{
        req.user.createChat({
            message : message
        })
        res.status(200).json({success : true})
    }catch(err){
        console.log(err)
    }
}