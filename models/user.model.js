import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        minlength:3
    },
    lastName:{
        type:String,
        required:true,
        minlength:3
    },  
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    socketId:{
        type:String
    }
},{
    timestamps:true
})
export default mongoose.model("User",userSchema)