import express from 'express'
import { getMeController, loginController, logout, RefreshTokenController, RegisterController } from '../controller/authController.js'
const router = express.Router()
router.post("/register",RegisterController)
router.post("/login",loginController)
router.get("/logout",logout)
router.get("/refresh-token",RefreshTokenController)
router.get("/userProfile",getMeController)
export default router