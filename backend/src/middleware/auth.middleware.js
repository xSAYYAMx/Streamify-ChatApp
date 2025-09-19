import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protectRoute(req,res,next){
    try {
         const token = req.cookies.jwt;

         if(!token){
            return res.status(401).json({
                message: "Unauthorised - No token provided"
            })
         }

         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         if(!decoded){
            return res.status(401).json({
                message: "Unauthorised - Invalid Token"
            })
         }

         const user = await User.findById(decoded.userId).select("-password");

         if(!user){
            return res.status(401).json({
                message: "Unauthorised - User not found"
            })
         }

         req.user = user

         next();


    } catch (error) {
        console.log("Error in protectedRoute Middleware", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
        
    }
}