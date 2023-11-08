import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./utils/database";


const app = express()
const Port = 3000

import User from "./Models/User";
import Chat from "./Models/chat";
import Group from "./Models/group";
import userGroup from "./Models/usergroup";

Chat.belongsTo(User)
User.hasMany(Chat)

User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });

Group.hasMany(Chat, { foreignKey: 'groupId' });
Chat.belongsTo(Group, {foreignKey : 'groupId'})

//routes
import userRoutes from "./routes/user"
import chatRoutes from './routes/chat'
import groupRoutes from './routes/group'

app.use(bodyParser.json())
app.use(cors())
app.use('/user', userRoutes)
app.use('/chat', chatRoutes)
app.use('/group', groupRoutes)

sequelize.sync().then(()=>{
    app.listen(Port, () => {
        console.log(`Server is Running on ${Port}`)
    })
}).catch(err => console.log(err))

