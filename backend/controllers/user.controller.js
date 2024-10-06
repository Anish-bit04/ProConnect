import cloudinary from "../lib/cloudinary"
import User from "../models/user.model"

export const getSuggestedConnection = async(req,res)=>{
    try{
        const currentUser =  await User.findById(req.user._id).select("connections")

        const suggestedUser = await User.find({
            _id:{
                $ne: req.user._id,              // not equal
                $nin: currentUser.connections   //not in
            }
        })
        .select('name username profilePicture headline')
        .limit(4)

        res.staus(201).json(suggestedUser)
    }catch(err){
        console.log('error in getSuggestedConnection user controller',err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getPublicProfile = async(req,res)=>{
    try {
        const user = await User.findOne({username:req.params.username}).select("-password")

        if(!user){
            return res.status(404).josn({message:"User not Found"})
        }
        res.json(user)
    } catch (error) {
        console.log('error in getPublicProfile',error)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const updateProfile = async(req,res)=>{
    try {
        const allowedFields =[
        "name",
        "username",
        "headline",
        "about" ,
        "location",
        "profilePicture",
        "bannerlmg",
        "skills",
        "experience",
        "education"
    ]
    const updatedData={}

    for(const field of allowedFields){
        if(req.body[field]){
            updatedData[field]= req.body[field];
        }
    }

    if(req.body.profilePicture){
        const result = await cloudinary.uploader.upload(req.body.profilePicture)
        updatedData.profilePicture = result.secure_url
    }
    if(req.body.bannerImg){
        const result = await cloudinary.uploader.upload(req.body.bannerImg)
        updatedData.bannerImg = result.secure_url
    }

    const user = await User.findByIdAndUpdate(req.user._id,{
        $set:updatedData},{new: true}).select("-password")

    res.status(201).josn(user)
    } catch (error) {
        console.log("Error in updateProfile",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

