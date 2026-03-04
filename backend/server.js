import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config.js'

//app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

//api endpoints
app.use("/api/food",foodRouter); //creates a route that states “For every request that starts with /api/food, hand it over to foodRouter.”
app.use("/api/user",userRouter);
app.use("/images",express.static('uploads'))

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})
//mongodb+srv://foodapplication:sauravroy@cluster0.xztgd2d.mongodb.net/?
