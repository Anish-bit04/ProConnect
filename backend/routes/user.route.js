import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { getSuggestedConnection, getPublicProfile } from "../controllers/user.controller";

const router = express.Router()

router.get('/suggestions',protectedRoute,getSuggestedConnection)
router.get('/:username',protectedRoute,getPublicProfile)

export default router