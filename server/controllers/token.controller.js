import {VerifyToken} from "../auth/jwt.js"
import User from "../models/user.schema.js"
import {GenerateAccessToken,GenerateRefreshToken} from "../auth/jwt.js"


// hydration
export const hydrateAccessToken = async(req,res)=>{
    const refreshToken = req.cookies.token;
    if(!refreshToken) return res.status(401).json({msg:"no refresh token in cookie ,please login"})

   try{
     const decoded = VerifyToken(refreshToken);

     // fetching the user from the db
      const user = await User.findById(decoded.id);

     const accessToken = GenerateAccessToken({
        id:user._id
     })

     // recreate refresh token
     const newRefreshToken = GenerateRefreshToken({
        id:user._id,
        email:user.email
     })

     //set in cookie
     res.cookie("token",newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
     })

     return res.status(200).json({msg:"access token hydrated successfully ",accessToken})
   }catch(error){
    return res.status(401).json({msg:"invalid refresh token , please login again",error:error.message})
   }

}