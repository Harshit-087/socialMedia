import cloudinary from "@/lib/cloudinary"
import {NextRequest,NextResponse} from "next/server"
import { CloudinaryUploadResponse } from "../image_upload/route";
import axios from "axios";

export async function POST(request:NextRequest){
  const formData = await request.formData();
   const banner =   formData.get("banner");
    const icon =    formData.get("icon");
    const userId =    formData.get("id");
     const token =   formData.get("token");
      const theme =  formData.get("theme");
     const name =   formData.get("communityName");
     const description=   formData.get("description");
     const tech =   formData.get("tech");
    const privacy =    formData.get("privacy");

    if(!banner || !(banner instanceof File)){
       return NextResponse.json({message:"the banner is missing"},{status:400})
    }
    if(!icon || !(icon instanceof File)){
        return NextResponse.json({message:"icon is required"},{status:400})
    }
      if(!userId){
      return NextResponse.json({error:"authorization error"},{status:401})
    }


    //  converting the baner and icon to array buffer then buffer.
    // banner 
    const bytes_banner = await banner.arrayBuffer();
    const buffer_banner =  Buffer.from(bytes_banner);

    //icon
    const bytes_icon = await icon.arrayBuffer();
    const buffer_icon = Buffer.from(bytes_icon);

    try{
    const resultBanner  =await new Promise<CloudinaryUploadResponse>((resolve,reject)=>{
        const upload_banner = cloudinary.uploader.upload_stream(
            {folder:"social_community_banner"},
            (error,result)=>{
                if(error) reject(error);
                else{
                    resolve (result as CloudinaryUploadResponse);
                }
            }
        ) 
        upload_banner.on("finish",()=>console.log("successfully finished"));
        upload_banner.on("error",(err)=>console.log("error in uploading",err))
        upload_banner.end(buffer_banner)
    })

    const result_icon =await new Promise<CloudinaryUploadResponse>((resolve,reject)=>{
        const upload_icon = cloudinary.uploader.upload_stream(
            {folder:"social_community_icon"},
            (error,result)=>{
                if(error) reject(error);
                else{
                    resolve (result as CloudinaryUploadResponse);
                }
            }
        )
        upload_icon.on("finish",()=>console.log("successfully finished"));
        upload_icon.on("error",(err)=>console.log("error in uploading",err))
        upload_icon.end(buffer_icon)
    })

    // going to backend 
 

    console.log("going to backend",process.env.NEXT_PUBLIC_BACKEND_URL)
    const backendResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/community-api/create`,{
            userId:userId,
            banner_url:resultBanner?.secure_url,
            icon_url:result_icon?.secure_url,
            name:name,
            description:description,
            category:tech,
            theme:theme,
            privacy:privacy
         },{
                headers:{
                    "content-type":"application/json",
                    Authorization:`Bearer ${token}`
                },timeout:10000
            })

            return NextResponse.json({message:"succesfully created community",data:backendResponse.data.data},{status:201})
        }catch(error){
           const err = error as{
            message?:string,
            name?:string,
            response?:{
                data?:unknown,
                status?:unknown
            },
            http_code?:number
           }

            return NextResponse.json(
    { error: "failed to upload image", details: err?.message },
    { status: 500 }
  );
        }
}