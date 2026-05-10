import * as z from "zod"

export const createVideoSchema = z.object({
    userId:z.string().min(1),
    url:z.string().url(),
    public_id : z.string(),
    caption:z.string().optional()
})

export const fetchVideoSchema = z.object({
    userId:z.string()
})