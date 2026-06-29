import express from 'express'
import {RegisterController,  CaptainloginController, getMeCaptain, logoutController, RefreshTokenCaptainController } from '../controller/captainController.js'
const captainRouter = express.Router()
captainRouter.post("/register-captain",RegisterController)
captainRouter.post("/login-captain",CaptainloginController)
captainRouter.get("/getMe-captain",getMeCaptain)
captainRouter.get("/logout-captain",logoutController)
captainRouter.get("/refreshtoken-captain",RefreshTokenCaptainController)
export default  captainRouter