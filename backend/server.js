import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"
import { connectDb } from "./lib/db.js"

dotenv.config()
const app = express()

const PORT= process.env.PORT || 4000

app.use('/api/v2/auth',authRoutes)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDb()
})