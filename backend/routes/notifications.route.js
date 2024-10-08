import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { deleteNotification, getUserNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";

const router = express.Router()

router.get('/',protectedRoute,getUserNotifications)
router.put('/:id/read',protectedRoute,markNotificationAsRead)
router.put('/:id',protectedRoute,deleteNotification)

export default router