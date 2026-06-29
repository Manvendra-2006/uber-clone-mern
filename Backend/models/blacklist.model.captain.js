import mongoose from "mongoose";
const BlackListSchema= new mongoose.Schema({
    accessToken:{
        type:String,
        required:true
    },
    captainId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Captain",
        required:true,
    }
},{
    timestamps:true
})
export default mongoose.model("BlackListCaptain",BlackListSchema)