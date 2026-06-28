import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Session from "../models/session.model.js"
import crypto from 'crypto'
import BlackList from "../models/blacklist.model.js"
export async function RegisterController(req,resp){
    try{
        const {name,email,password} = req.body
        if(!name||!email||!password){
            return resp.status(400).json({message:"All fields are required"})
        }
        const user = await User.findOne({email})
        if(user){
            return resp.status(404).json({message:"User is already registered"})
        }
        const hashPassword  = await bcrypt.hash(password,10)
        if(!hashPassword){
            return resp.status(404).json({message:"Password is not hashed properly"})
        }               
        const newUser = await User.create({
            name,
            email,
            password:hashPassword
        })
        const refreshToken =  await jwt.sign(
            {id:newUser._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"7d"}
        )
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const session = await Session.create({
            userId:newUser._id,
            ip:req.ip,
            userAgent:req.headers["user-agent"],
            refreshTokenHash
        })
        const accessToken = await  jwt.sign(
            {id:newUser._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"15m"}
        )
        resp.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            sameSite:"strict",
            secure:false,
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return resp.status(201).json({message:"New User is created",newUser,accessToken})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}
export async function loginController(req,resp){
    try{
        const {email,password} = req.body
        if(!email||!password){
            return resp.status(400).json({message:"All fields are required"})
        }
        const isUserExists = await User.findOne({email}).select("+password")
        if(!isUserExists){
            return resp.status(400).json({message:"User is not registered"})
        }
        const compare = await bcrypt.compare(password,isUserExists.password)
        if(!compare){
            return resp.status(404).json({message:"Password is not compare"})
        }
        
        const refreshToken = await jwt.sign(
            {id:isUserExists._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"7d"}
        )
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const session = await Session.create({
            ip:req.ip,
            refreshTokenHash,
            userId:isUserExists._id,
            userAgent:req.headers["user-agent"]
        })
        const accessToken = await jwt.sign(
            {id:isUserExists._id,sessionId:session._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'15m'}
        )
        resp.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            sameSite:"strict",
            secure:false,
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return resp.status(200).json({message:"Login Successfully",accessToken,isUserExists})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}
export async function logout(req,resp){
    try{
        const accessToken = req.headers.authorization?.split(" ")[1]
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return resp.status(404).json({message:"Refresh Token required"})
        }
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET_KEY)        
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const session = await Session.findOne({refreshTokenHash,
            userId:decoded.id,
            revoked:false
        })
        if(!session){
            return resp.status(404).json({message:"Session expired"})
        }
        session.revoked = true
        await session.save()
        const blacklist = await BlackList.create({
            accessToken,
            userId:decoded.id
        })
        if(blacklist){
            resp.clearCookie("refreshToken")
            return resp.status(200).json({message:"Logout Successfully"})
        }
    }
    catch(error){
        return resp.status(500).json({message:"Intenal Server Error",error})
    }
}
export async function RefreshTokenController(req,resp){
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return resp.status(404).json({message:"RefrehToken is invalid"})
        }
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET_KEY)
        const session = await Session.findOne({
            userId:decoded.id,
            refreshTokenHash,
            revoked:false
        })
        if(!session){
            return resp.status(400).json({message:"Session has been expired"})
        }
        const accessToken = await jwt.sign(
            {id:decoded.id,sessionId:session._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"15m"}
        )
        const newrefreshToken = await jwt.sign(
            {id:decoded.id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"15m"}
        )
        const newrefreshTokenHash = crypto.createHash("sha256").update(newrefreshToken).digest("hex")
        session.refreshTokenHash = newrefreshTokenHash
        await session.save()
        resp.cookie("refreshToken",newrefreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return resp.status(201).json({
            message:"New Access Token is generated",
            accessToken
        })
    }
    catch(error)
    {
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}
export async function getMeController(req,resp){
    try{
        const accessToken = req.headers.authorization?.split(" ")[1]
        if(!accessToken){
            return resp.status(404).json({message:"AccessToken required"})
        }
        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET_KEY)
        const userData = await User.findOne({
            _id:decoded.id
        })
        const blacklist = await BlackList.findOne({

            accessToken
        })
        if(blacklist){
            return resp.status(400).json({message:"Blacklisted token"})
        }
        if(userData){
            return resp.status(200).json({message:"User Data get",userData})
        }
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}
