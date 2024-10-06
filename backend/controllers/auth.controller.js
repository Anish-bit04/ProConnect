import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../emails/emailHandler.js"


export const signup = async(req, res) => {
    try{
        const { name, username, email, password } = req.body

        if(!name || !username || !email || !password){
            return res.status(400).json({msg: "Please enter all fields"})
        }

        const existUsername = await User.findOne({username})

        if(existUsername){
            return res.status(400).json({msg: "Username already exists"})
        }

        const existEmail = await User.findOne({email})

        if(existEmail){
            return res.status(400).json({msg: "Email already exists"})
        }

        if(password.length < 6){
            return res.status(400).json({msg: "Password must be at least 6 characters"})
        }

        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            username,
            email,
            password: hashPassword
        })

        await newUser.save()

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
      
        res.cookie("jwt-proconnect",token,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure:process.env.NODE_ENV === "production"
        })

        res.status(201).json({msg: "User created"})

    const profileUrl = process.env.CLIENT_URL + "/profile/" + newUser.username;

		try {
			await sendWelcomeEmail(newUser.email, newUser.name, profileUrl);
		} catch (emailError) {
            console.log('inisde mail')
			console.error("Error sending welcome Email", emailError);
		}

    }catch(err){    
        console.log("Error in Signup",err.message)
        res.status(500).send("Internal Server Error")
    }
}

export const login = async(req, res) => {
    try{
        const {username,password} = req.body;
        const user = User.findOne({username})
        if(!user){
            return res.status(400).json({message:"Email doesn't exist"})
        }
    
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
    
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
    
        await res.cookie("jwt-proconnect",token,{
            httpOnly:true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure:process.env.NODE_ENV === "production"
        })
        res.status(201).json({
            message:"Logged In Successfully"
        })
    }catch(err){
        console.log("Error in Login:",err.message)
        res.status(500).json({message:"Internal Server Error"})
    }

}   

export const logout = (req, res) => { 
    try{
        res.clearCookie("jwt-proconnect")
        res.send("logout")
    }catch(err){
        console.log("error in logout:",err.message)
        res.status(500).json({message:'Internal Server Error'})
    }
}       

