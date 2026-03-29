import express from "express"
import cors from "cors"
import http from "http";
import { initSocket } from "./config/socket.js";
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import 'dotenv/config.js'
import orderRouter from "./routes/orderRoute.js"
import deliveryRouter from "./routes/deliveryRoute.js"

//app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors())

//db connection
const startServer = async () => {
    try {
        await connectDB();
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

//api endpoints
app.use("/api/food", foodRouter); //creates a route that states “For every request that starts with /api/food, hand it over to foodRouter.”
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/images", express.static('uploads'))

app.get("/", (req, res) => {
    res.send("API Working")
})

const server = http.createServer(app);
initSocket(server);

startServer();
//mongodb+srv://foodapplication:sauravroy@cluster0.xztgd2d.mongodb.net/?
