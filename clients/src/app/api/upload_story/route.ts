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

    try{
        const uploadStory =await new Promise<CloudinaryUploadResponse>(
            (resolve,reject)=>{
                const storyUploading = cloudinary.uploader.upload_stream(
                     {
                        upload_preset:"socialmedia_story_preset",  // instead of uploading to folder amnually we do this 
                        resource_type:"auto"
                     },
                     (error,result)=>{
                        if(error) {reject(error)}
                        else{
                            resolve(result as CloudinaryUploadResponse)
                        }
                     }
                )
                storyUploading.on("finished",()=>console.log("stream finished"))
                storyUploading.on("error",(error)=>console.log("errorr in uploading ",error))

                storyUploading.end(buffer);
            }
        )

        console.log("uploading story to backend")

        const backendResponse = await axios.post(
            `${process.env.BACKEND_URL}/story-api/create`,{
                userId:userId,
                public_url:uploadStory.public_id,
                url:uploadStory.secure_url,
                mediatype:uploadStory.resource_type
            },{
                headers:{
                    "content-type":"application/json",
                    Authorization:`Bearer ${token}`
                },timeout:10000
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