import mongoose from "mongoose";
const BlackListSchema= new mongoose.Schema({
    accessToken:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{
    timestamps:true
})
export default mongoose.model("BlackList",BlackListSchema)