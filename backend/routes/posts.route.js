import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { likePost,createPost, deletePost, getPostById, createComment, getFeedPosts } from "../controllers/post.controller.js";

const router= express.Router()

router.get('/',protectedRoute,getFeedPosts)
router.post('/create',protectedRoute,createPost)
router.delete('/delete/:id',protectedRoute,deletePost)
router.get('/:id',protectedRoute,getPostById)

router.get('/:id/comment',protectedRoute,createComment)
router.get('/:id/like',protectedRoute,likePost)



export default router