import bcrypt from "bcryptjs";
import User from "../models/user.schema.js";
import {GenerateToken} from "../auth/jwt.js"
import mongoose from "mongoose"
import Post from "../models/post.schema.js"

 export const Register  = async(req,res)=>{ 
   
    const {username,email,password,bio,profileImage,website,isPrivate} = req.body
    console.log(req.body)
 try{
    let role="user"

    if(email==process.env.ADMIN_EMAIL){
         role = "admin"
         
    }

    const salt= await bcrypt.genSalt(10);
    const hash_password= await bcrypt.hash(password,salt);

    const createdUser = await User.create({
        username,
        email,
        password:hash_password,
        role,
        bio,
        profileImage,
        website,
        isPrivate
    })
    if(createdUser){
        res.status(200).json({
            msg:"new user registered success",
            data:createdUser
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

    console.log(req.body)
    const {email,password} = req.body
    const userExist = await User.findOne({email:email})
    if(!userExist){
    return res.status(404).json({msg:" user not exist"}) 
}

    const isPasswordValid = await bcrypt.compare(password,userExist.password)

    if(!isPasswordValid) {
      return  res.status(401).json({msg:"invalid credentials"})
    }
    const token= GenerateToken({email,id:userExist._id})
    
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // required for HTTPS
  sameSite: "lax", // use "none" only if cross-site
  maxAge: 1000 * 60 * 60 * 24, // 1 day
});
    
    return res.status(200).json({ 
        msg:"login success",
        token,
        _id:userExist._id,
       username:userExist.username ,
          role:userExist,
          email: userExist.email,
          isPrivate: userExist.isPrivate,
          profileImage: userExist.profileImage,
          bio: userExist.bio,
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
    const userDetail = await User.find({_id:new mongoose.Types.ObjectId(id)})
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