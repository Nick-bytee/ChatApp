import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./utils/database";


const app = express()
const Port = 3000



//routes
import userRoutes from "./routes/user"
import chatRoutes from './routes/chat'

app.use(bodyParser.json())
app.use(cors())
app.use('/user', userRoutes)
app.use('/chat', chatRoutes)

sequelize.sync().then(()=>{
    app.listen(Port, () => {
        console.log(`Server is Running on ${Port}`)
    })
}).catch(err => console.log(err))

