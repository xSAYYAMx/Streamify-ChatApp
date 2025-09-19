import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists, please use a different one",
      });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // creating user in Stream
        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || ""
        })
        console.log(`Stream user created for user: ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating stream user", error);
        }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } 
  
  catch (error) {
    console.log("Error in signup controller", error);
    res.status(400).json({
        message: "Internal Server error"
    })
    
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    // console.log(email);
    // console.log(password);
    
    

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            message: "Email or password is incorrect"
        })
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect){
        return res.status(401).json({
            message: "Email or password is incorrect"
        })
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        expiresIn: "7d",
        httpOnly: true, // prevent XSS attack
        sameSite: "strict", // prevent CSRF attacks
        secure: process.env.NODE_ENV === "production",
    })

    res.status(200).json({
        success: true,
        user
    })

  } catch (error) {
    console.log("Error in login controller", error);
    res.status(400).json({
        message: "Internal Server error"
    })
    
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "Logout successful"
  })
}

export async function onboard(req, res){
    try {
        const userId = req.user._id;

        const{fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, {new: true})

        if(!updatedUser){
            return res.status(404).json({
                message: "User not found"
            })
        }

        // TODO - UPDATE THE USER INFO IN STREAM
        try {
            await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || ""
        })
        console.log(`Stream user updted after onboarding for ${updatedUser.fullName}`);        
        } catch (streamError) {
            console.log("Error updating stream user during onboarding", streamError.message);
            
        }

        res.status(200).json({
            success: true,
            user: updatedUser
        })

    } catch (error) {
        console.log("Onboarding error",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
    
}