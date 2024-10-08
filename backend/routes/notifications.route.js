import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { deleteNotification, getUserNotifications, markNotificationAsRead } from "../controllers/notification.controller";

const router = express.Router()

router.get('/',protectedRoute,getUserNotifications)
router.put('/:id/read',protectedRoute,markNotificationAsRead)
router.put('/:id',protectedRoute,deleteNotification)

export default router