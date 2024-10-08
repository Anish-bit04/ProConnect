import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getSuggestedConnection, getPublicProfile, updateProfile } from "../controllers/user.controller.js";

const router = express.Router()

router.get('/suggestions',protectedRoute,getSuggestedConnection)
router.get('/:username',protectedRoute,getPublicProfile)

router.put('/profile',protectedRoute,updateProfile)

export default router