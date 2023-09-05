import { Request, Response } from "express"
import Chat from "../Models/chat"
import sequelize from "../utils/database"

interface CustomRequest extends Request {
    user?: any
}

export const getAllChat = async(req : Request, res: Response) => {

    const chat = null

}

export const storeChat = async(req : CustomRequest, res: Response)=> {
    const t = sequelize.transaction()
    const message = req.body.message
    const user = req.user.dataValues
    try{
        await Chat.create({
            userId : user.id,
            message : message
        })
        res.status(200).json({success : true})
    }catch(err){
        console.log(err)
    }
}