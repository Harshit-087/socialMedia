
import * as z from "zod"

export const createStorySchema = z.object({
  userId: z.string().min(1),
  public_url: z.string(),
  url: z.string(),
  mediaType: z.enum(["image", "video"]),
})

export const fetchStorySchema = z.object({
  id: z.string().min(1),
})