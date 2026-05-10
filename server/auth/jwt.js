import jwt from "jsonwebtoken"
import {config} from "../config/config.js"

export  function GenerateAccessToken(payload){
return jwt.sign(payload,process.env.SECRET,{expiresIn:"1h"});
}

export  function GenerateRefreshToken(payload){
return jwt.sign(payload,process.env.SECRET,{expiresIn:"7d"});
}

export  function VerifyToken(token){
    return jwt.verify(token,process.env.SECRET)
} 