import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http";
import { initSocket } from "./config/socket.js";
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import 'dotenv/config.js'
import orderRouter from "./routes/orderRoute.js"
import deliveryRouter from "./routes/deliveryRoute.js"
import categoryRouter from "./routes/categoryRoute.js";

//app config
const app = express()
const port = process.env.PORT || 4000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(",").map((o) => o.trim()).filter(Boolean) : []),
];

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}))

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
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/category", categoryRouter);

app.get("/", (req, res) => {
    res.send("API Working")
})

const server = http.createServer(app);
initSocket(server, allowedOrigins);

startServer();
