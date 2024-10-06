import cloudinary from "../lib/cloudinary";
import Notification from "../models/notification.model";
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
        .populate("author","name email username profilePicture headline")
        .populate("comments.user","name email username profilePicture headline")

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(201).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



export const createComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const { content } = req.body;

		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: { user: req.user._id, content } },
			},
			{ new: true }
		).populate("author", "name email username headline profilePicture");

		// create a notification if the comment owner is not the post owner
		if (post.author._id.toString() !== req.user._id.toString()) {
			const newNotification = new Notification({
				recipient: post.author,
				type: "comment",
				relatedUser: req.user._id,
				relatedPost: postId,
			});

			await newNotification.save();

			try {
				const postUrl = process.env.CLIENT_URL + "/post/" + postId;
				await sendCommentNotificationEmail(
					post.author.email,
					post.author.name,
					req.user.name,
					postUrl,
					content
				);
			} catch (error) {
				console.log("Error in sending comment notification email:", error);
			}
		}

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in createComment controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const likePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);
		const userId = req.user._id;

		if (post.likes.includes(userId)) {
			// unlike the post
			post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
		} else {
			// like the post
			post.likes.push(userId);
			// create a notification if the post owner is not the user who liked
			if (post.author.toString() !== userId.toString()) {
				const newNotification = new Notification({
					recipient: post.author,
					type: "like",
					relatedUser: userId,
					relatedPost: postId,
				});

				await newNotification.save();
			}
		}

		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in likePost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};