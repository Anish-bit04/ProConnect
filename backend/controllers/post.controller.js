import cloudinary from "../lib/cloudinary";
import Post from "../models/posts.model";

export const getFeedPosts = async (req, res) => {
    try {

        // used populate method to get auther details and comments people details
        const posts = await Post.find({auther:{$in:req.user.connections}})
        .populate("author","name username profilePicture headline")
        .populate("comments.user","name username profilePicture headline")
        .sort({createdAt:-1})


        res.status(201).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const createPost = async (req, res) => {
    try {
        const {content,image} = req.body;

        let newPosts;

        if(image){
            const imgResult = await cloudinary.uploader.upload(image)

            newPosts = new Post({
                content,
                image:imgResult.secure_url,
                auther:req.user._id
            })
        }else{
            newPosts = new Post({
                content,
                auther:req.user._id
            })
        }

        await newPosts.save();

        res.status(201).json(newPosts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post= await Post.findById(postId);

        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        // check if post auther is same as user
        if(post.author.toString() !== userId){
            return res.status(401).json({ message: "Unauthorized" });   
        }

        // "https://res.cloudinary.com/dvhrffmdi/image/upload/v1725425863/lfgm5mkjztbwumssmahizv.png"
        if(post.image){
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }

        await Post.findByIdAndDelete(postId);

        res.status(201).json({ message: "Post deleted successfully" }); 
    } catch (err) { 
        console.log("error in delete post",err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const post = await Post.findById(postId)
        .populate("author","name username profilePicture headline")
        .populate("comments.user","name username profilePicture headline")

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(201).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}