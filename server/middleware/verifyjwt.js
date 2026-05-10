import  {VerifyToken } from "../auth/jwt.js"
export function AuthMiddleware(req,res,next){
   
    const authHeader = req.headers["authorization"];
    if(!authHeader) return res.status(401).json({msg:"Not logged in"})


    const token= req.headers.authorization?.split(" ")[1];  //"bearer  jfjgf354@Y%Y4...." 

    try{
        const decoded= VerifyToken(token)
         req.user = decoded; // Attach user info to the request
       next();
    }catch(err){
        console.log(err.message)
        return res.status(401).json({ message: "Invalid token" });
    }
    
} 