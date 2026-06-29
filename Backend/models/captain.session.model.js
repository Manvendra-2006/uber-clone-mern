import mongoose from "mongoose";

const sessionModel = new mongoose.Schema({
    captainId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Captain",
        required:true,
    },
    userAgent:{
        type:String,
        required:true
    },
    ip:{
        type:String,
        required:true
    },
    refreshTokenHash:{
        type:String,
        required:true
    },
    revoked:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
export default mongoose.model("SessionCaptain",sessionModel)