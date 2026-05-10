import bcrypt from "bcryptjs";
import User from "../models/user.schema.js";
import {GenerateRefreshToken,GenerateAccessToken} from "../auth/jwt.js"
import mongoose from "mongoose"
import Post from "../models/post.schema.js"
import * as validator from "../validator/user.validator.js"

 export const Register  = async(req,res)=>{ 
    try{
     const validationResult = validator.userSchema.safeParse(req.body)
     if(!validationResult.success){
         return res.status(400).json({msg:"validation error",error:validationResult.error.issues})
     }
       
    const data = validationResult.data;
     //checking if user exist in the db
     const userExist = await User.findOne({email:data.email})
     if(userExist){
        return res.status(400).json({msg:"user already exist "})
     }
    
   data.role = data.email==process.env.ADMIN_EMAIL?"admin":"user";

     const salt= await bcrypt.genSalt(10);
    const hash_password= await bcrypt.hash(data.password,salt);

    data.password = hash_password;
   
    // saving to database
    const createdUser = await User.create(data); 
  //createdUser is the mongoose document , it have extra prop like getter and setter etc.
   
  //create document
  const userResponse = createdUser.toObject();
  delete userResponse.password;

    if(userResponse){
        res.status(201).json({
            msg:"new user registered success",
            data:userResponse
        })
    }else{
        res.status(500).json({msg:"bad request"})
    }
}catch(error){
     console.error(error);
    res.status(500).json({ msg: "server error", error: error.message });
}
}


export const Signin = async(req,res)=>{
   
    // validation
    const validationResult = validator.validateUserSignin.safeParse(req.body);
    
    if(!validationResult.success){
        return res.status(400).json({msg:"validation error",error:validationResult.error.issues})
    }
     const data = validationResult.data;

     // checking from database
    const userExist = await User.findOne({email:data.email})
    if(!userExist){
    return res.status(404).json({msg:" user not exist"}) 
}

    const isPasswordValid = await bcrypt.compare(data.password,userExist.password)

    if(!isPasswordValid) {
      return  res.status(401).json({msg:"invalid credentials"})
    }
    // creating refresh token
    const refreshToken= GenerateRefreshToken({email:data.email,id:userExist._id})

    //creating access token
    const accessToken = GenerateAccessToken({id:userExist._id})
    
    res.cookie("token", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // required for HTTPS
  sameSite: "lax", // use "none" only if cross-site
  maxAge: 1000 * 60 * 60 * 24, // 1 day
});
    const userResponse = userExist.toObject();
    delete userResponse.password;
    return res.status(200).json({ 
        msg:"login success",
        accessToken,
        data:userResponse
    })
    
}


export const findUser = async(req,res)=>{
     const {user} =req.query;
   
     try{
     const dbUsers =await User.find({
        //regular  expression for matching case-sensitive name 
        username:{$regex:new RegExp(`^${user}$`,"i")}});  
       return res.status(200).json({msg:"fetched user success",data:dbUsers})

     }catch(err){
        console.log("error in finding user",err)
        return res.status(500).json({msg:"server error in finding user",error:err.message})
     }

}

export const fetchProfile=async(req,res)=>{
   const {id} = req.query;

   try{
    const userDetail = await User.findById(id).select("-password -email -role -createAt -updatedAt -__v")
    const countPost = await Post.aggregate([
        {$match:{userId:new mongoose.Types.ObjectId(id)}},
        {
            $group:{
                _id:"$postId",
                count:{$sum:1}
            }
        }
    ])

    return res.status(200).json({msg:"successfully fetched profile",data:userDetail,countPost})
   }catch(err){
    console.log("error in fetching profile",err)
    return res.status(500).json({msg:"server error",error:err.message})
   }
}




// update password
export const updatePassword = async(req,res)=>{
    try{
        const validationResponse = validator.updatePassword.safeParse(req.body)
         if(!validationResponse.success){
        return res.status(400).json({msg:"validation error",error:validationResponse.error.issues})
    }
     const data = validationResponse.data;
      
     const updatePassword = await User.findByIdAndUpdate(data.id,data.password,{new:true});
     return res.status(200).json({message:"successfully updated the password",data:updatePassword})

    }catch(err){
    console.log("error in fetching profile",err)
    return res.status(500).json({msg:"server error",error:err.message})
   }
}