import Captain from "../models/captain.model.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import SessionCaptain from "../models/captain.session.model.js"
import BlackList from "../models/blacklist.model.js"
import BlackListCaptain from "../models/blacklist.model.captain.js"
export  async  function RegisterController(req,resp){
    try{
        const {name , email , password,vehicle} = req.body
        if(!name||!email||!password||!vehicle){
            return resp.status(400).json({message:"All Fields are required"})
        }
        const isCaptainExists = await Captain.findOne({
            email
        })
        if(isCaptainExists){
            return resp.status(400).json({message:"Captain is already registered"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        if(!hashPassword){
            return resp.status(500).json({message:"Password is not hashed"})
        }
        const newCaptain = await Captain.create({
            name,
            email,
            password:hashPassword,
            vehicle:{
            vehicleType:vehicle.vehicleType,
            capacity:vehicle.capacity,
            color:vehicle.color,
            plate:vehicle.plate
            }
        })
        const refreshToken = await jwt.sign(
            {id:newCaptain._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'7d'}
        )
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const session = await SessionCaptain.create({
            refreshTokenHash,
            ip:req.ip,
            userAgent:req.headers["user-agent"],
            captainId:newCaptain._id,

        })
        const accessToken = await jwt.sign(
            {id:newCaptain._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"15m"}
        )
        resp.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return resp.status(201).json({message:"Captain is created",accessToken,newCaptain})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Errror",error})
    }
}
export async function CaptainloginController(req,resp){
    try{
        const {email,password} = req.body
        if(!email||!password){
            return resp.status(400).json({message:"All Fields are required"})
        }
        const isCaptain = await Captain.findOne({email})
        if(!isCaptain){
            return resp.status(400).json({message:"Captain is not registerd"})
        }
        const compare = await bcrypt.compare(password,isCaptain.password)
        if(!compare){
            return resp.status(400).json({message:"Password is not compared"})
        }
        const refreshToken = await jwt.sign(
            {id:isCaptain._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"7d"}
        )
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const session = await SessionCaptain.create({
            ip:req.ip,
            refreshTokenHash,
            userAgent:req.headers["user-agent"],
            captainId:isCaptain._id
        })
        const accessToken = await jwt.sign(
            {id:isCaptain._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"15m"}
        )
        resp.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            sameSite:"strict",
            secure:false,
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return resp.status(201).json({message:"Login Successfully",accessToken})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}
export async function getMeCaptain(req,resp){
    try{
        const accessToken = req.headers.authorization?.split(" ")[1]

        if(!accessToken){
            return resp.status(400).json({message:"Refresh Token is not valid"})
        }
                const decoded = jwt.verify(accessToken,process.env.JWT_SECRET_KEY)
        const BlackListToken = await BlackListCaptain.findOne({captainId:decoded.id})
        if(BlackListToken){
            return resp.status(400).json({message:"Token is BlackListed"})
        }
        console.log(decoded.id)
        const captainProfile = await Captain.findById(decoded.id)
        if(!captainProfile){
            return resp.status(400).json({message:"Profile is not get"})
        }
        return resp.status(200).json({message:"Profile of Captain",captainProfile})
    }
    catch(error){
        resp.status(500).json({message:"Internal Server Error",error})
    }
}
export async function logoutController(req,resp){
    try{
        const refreshToken = req.cookies.refreshToken
        const accessToken = req.headers.authorization?.split(" ")[1]
    
        if(!accessToken){
            return resp.status(400).json({message:"Access Token is invalid"})
        }
        if(!refreshToken){
            return resp.status(400).json({message:"RefreshToken is invalid"})
        }
        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET_KEY)        
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const session = await SessionCaptain.findOne({
            revoked:false,
            refreshTokenHash,
            captainId:decoded.id,
        })      
        if(!session)  {
            return resp.status(400).json({message:"Session expired"})
        }
        session.revoked = true
        await session.save()
        const BlackListTOken = await BlackListCaptain.create({
            accessToken,
            captainId:decoded.id
        })
        if(BlackListTOken){
            return resp.status(200).json({message:"Logout Successfully"})
        }        
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}

export async function RefreshTokenCaptainController(req,resp){
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return resp.status(400).json({message:"RefreshTOken is invalid"})
        }
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET_KEY)
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
        const session = await SessionCaptain.findOne({
            refreshTokenHash,
            revoked:false,
            captainId:decoded.id
        })
        if(!session){
            return resp.status(400).json({message:"RefreshToken is invalid"})
        }
        const accessToken = await jwt.sign(
            {id:decoded.id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"15m"}
        )
        const newrefreshToken = await jwt.sign(
            {id:decoded.id},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"7d"}
        )
        const newrefreshTokenHash = crypto.createHash("sha256").update(newrefreshToken).digest("hex")
        session.refreshTokenHash = newrefreshTokenHash
        await session.save()
        resp.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            sameSite:"strict",
            secure:false,
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return resp.status(201).json({message:"New Access Token is generated",accessToken})
    }
    catch(error){
        return resp.status(500).json({message:"Internal Server Error",error})
    }
}