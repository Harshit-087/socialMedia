import jwt from "jsonwebtoken"

const secret="dnjngkjfdgjdf564@$!%^&*";

export  function GenerateToken(payload){
return jwt.sign({payload},secret,{expiresIn:"1h"});
}

export  function VerifyToken(token){
    return jwt.verify(token,secret)
} 