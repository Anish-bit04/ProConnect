import express from "express";
import { protectedRoute, createPost, deletePost, getPostById } from "../middleware/auth.middleware.js";

const router= express.Router()

router.get('/',protectedRoute,getFeedPosts)
router.post('/create',protectedRoute,createPost)
router.delete('/delete/:id',protectedRoute,deletePost)
router.get('/:id',protectedRoute,getPostById)


export default router