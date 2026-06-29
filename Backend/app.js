import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './routes/authRoutes.js'
import captainRouter from './routes/captainroutes.js'
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",router)
app.use("/api/auth",captainRouter)
app.get("/",(req,resp)=>{
    resp.send("Everything is working correctly")
})
export default app