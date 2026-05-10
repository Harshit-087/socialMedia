import * as z from "zod"


export const createPostSchema = z.object({
    userId:z.string().min(1),
    caption:z.string().optional(),
    location:z.string().optional(),
    media:z.array(
        z.object({
        url:z.string().url(),
        publicId:z.string(),
        mediaType:z.enum(["image","video"]),
        position:z.number().optional() 
    })
).min(1)
})

export const findPost = z.object({
    userId:z.string().min(1)
    
})


export const deletePostSchema = z.object({
  publicId: z.string(),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
})