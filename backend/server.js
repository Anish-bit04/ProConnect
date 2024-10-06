import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"
import { connectDb } from "./lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieParser())

const PORT= process.env.PORT || 4000

app.use('/api/v1/auth',authRoutes)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})