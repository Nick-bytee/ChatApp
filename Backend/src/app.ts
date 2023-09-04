import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./utils/database";


const app = express()
const Port = 3000



//routes
import userRoutes from "./routes/user"
app.use(bodyParser.json())
app.use(cors())
app.use('/user', userRoutes)

sequelize.sync().then(()=>{
    app.listen(Port, () => {
        console.log(`Server is Running on ${Port}`)
    })
}).catch(err => console.log(err))

