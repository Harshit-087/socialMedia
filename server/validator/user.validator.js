import * as z from "zod";

export const userSchema = z.object({
    username:z.string().min(3).max(20),
    email:z.string().email(),
    password:z.string().min(8).max(20),
    
    bio:z.string().min(10).max(300),
    profileImage:z.string().optional(),
    website:z.string().optional(),
    isPrivate:z.boolean().default(false)
})


export const validateUserSignin = z.object({
    email:z.string().email(),
    password:z.string().min(8).max(20)
})

export const updatePassword = z.object({
    id:z.string(),
    email:z.string(),
    password:z.string()
})