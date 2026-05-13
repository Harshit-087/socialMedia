import cloudinary from "@/lib/cloudinary"
import axios from "axios";
import {NextResponse,NextRequest} from "next/server"
import { CloudinaryUploadResponse } from "../image_upload/route";

export async  function POST(request:NextRequest){
  const formData = await request.formData();
  const  userId = formData.get("userId")
  const token = formData.get("token")
  const story = formData.get("story")

  if(!story || !(story instanceof File)){
    return NextResponse.json({message:"file not provided"},{status:400});
  }
  if(!userId){
      return NextResponse.json({error:"authorization error"},{status:401})
    }

    //converting to arraybuffer then buffer
    const bytes = await story.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if((story.size)>10*1024*1024){
        return NextResponse.json({message:"the file is too large"},{status:400})
    }
    console.log("going to cloudinary")

    try{
      const uploadStory = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
    const storyUploading = cloudinary.uploader.upload_stream(
      {
        folder: "socialmedia_story",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Callback Error:", error);
          return reject(error); // This breaks the promise so the catch block runs
        }
        if (!result) {
          return reject(new Error("Cloudinary upload resulted in empty response"));
        }
        resolve(result as CloudinaryUploadResponse); // This allows code to proceed
      }
    );

    // End the stream and send the buffer
    storyUploading.end(buffer);
  });

        console.log("uploading story to backend")

        const backendResponse = await axios.post(
            `${process.env.BACKEND_URL}/story-api/create_story`,{
                userId:userId,
                public_url:uploadStory.public_id,
                url:uploadStory.secure_url,
                mediaType:uploadStory.resource_type
            },{
                headers:{
                    "content-type":"application/json",
                    Authorization:`Bearer ${token}`
                },timeout:20000
            })
     console.log("Backend response:", backendResponse.data);

            return NextResponse.json({publicId:uploadStory.public_id,url:uploadStory.secure_url},{status:200})
    }catch(error){
         const err  = error as{      
    message?: string;
    name?: string;
    response?: {
      data?: unknown;
      status?: number;
    };
    http_code?: number;
  };
  return NextResponse.json(
    { error: "failed to upload image", details: err?.message },
    { status: 500 }
  );
    }
}