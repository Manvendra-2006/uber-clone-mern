import 'dotenv/config'
import app from './app.js'
import connectDb from '../config/config.js'
connectDb()
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port 7800 ${process.env.PORT}`)
})