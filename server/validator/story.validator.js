
import * as z from "zod"

export const createStorySchema = z.object({
  userId: z.string().min(1),
  mediatype: z.enum(["image", "video"]),
  url: z.string().url(),
  public_url: z.string().url(),
})

export const fetchStorySchema = z.object({
  id: z.string().min(1),
})