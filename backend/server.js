import express from "express"
import dotenv from "dotenv"
import  cors from "cors"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postsRoutes from "./routes/posts.route.js"
import notificationsRoutes from "./routes/notifications.route.js"
import connectionRoutes from "./routes/connection.route.js"

import { connectDb } from "./lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json({limit:'50mb'}))
app.use(cookieParser())

const PORT= process.env.PORT || 4000

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/posts',postsRoutes)
app.use('/api/v1/notifications',notificationsRoutes)
app.use('/api/v1/connections',connectionRoutes)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})