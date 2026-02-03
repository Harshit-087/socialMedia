import cloudinary from "@/lib/cloudinary"

import {NextRequest, NextResponse} from "next/server";
import axios from "axios"



interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

export async function POST(request: NextRequest){
  const formdata = await request.formData();
     const file = formdata.get("pictures") ;
     const userId = formdata.get("userId") ;
     const token = formdata.get("token") ;
     const caption = formdata.get("caption");
     
      if(!file || !(file instanceof File)){
        return NextResponse.json({error:"file not provided"},{status:400})
      }

    if(!userId){
      return NextResponse.json({error:"authorization error"},{status:401})
    }

  
     // for uploading file to cloudinary 
     // 1. convert to arraybuffer
     // 2. convert arraybuffer to buffer 

     const bytes = await file.arrayBuffer();
     const buffer = Buffer.from(bytes);

     if((file.size)>10*1024*1024){
      return NextResponse.json({error:"file is too large"},{status:400})
     }


     console.log("file size",file.size)
  
    

   try{

 const result =  await new Promise<CloudinaryUploadResponse>(
        (resolve,reject)=>{
          
      const uploadImage =  cloudinary.uploader.upload_stream(
            {folder:"socialmedia_posts"},
            (error,result)=>{
              if(error){
                reject(error)
              }
              else resolve(result as CloudinaryUploadResponse)
            }
           )

           uploadImage.on("finish",()=>console.log("stream finished"))
           uploadImage.on("error",(err)=>console.log("stream ended due to error",err))

            uploadImage.end(buffer)
        }
      )

   console.log("result",result)
 
   // log for checking going to backend with data .
   console.log("Posting to backend:", {
  backendUrl: `${process.env.BACKEND_URL}/post-api/uploadPost`,
  userId,
  publicId: result.public_id,
});

      // backend route
      //use {} for body and headers
  const backendResponse =   await axios.post(
      `${process.env.BACKEND_URL}/post-api/uploadPost`,
      {
        userId,
        publicId: result.public_id,
        url: result.secure_url,
        caption:caption
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
         timeout:10000,
      }
    )
 
console.log("Backend response:", backendResponse.data);



      return NextResponse.json({publicId:result.public_id,url:result.secure_url},{status:200})
    } catch (error) {
      const err  = error as{      
    message?: string;
    name?: string;
    response?: {
      data?: unknown;
      status?: number;
    };
    http_code?: number;
  };
      
  console.error("UPLOAD ERROR:", {
    message: err?.message,
    name: err?.name,
    response: err?.response?.data,
    status: err?.response?.status,
    cloudinary: !!err?.http_code, // helps detect Cloudinary errors
  });

  return NextResponse.json(
    { error: "failed to upload image", details: err?.message },
    { status: 500 }
  );
}

}



export async function DELETE(request:Request){

  const {searchParams} = new URL(request.url);
  const public_id = searchParams.get("publicId")
 const token  =searchParams.get("token")


  // const {public_id} = await request.json()

  if(!public_id){
    return NextResponse.json({error:"public_id is required"},{status:400})
  }

  try{
    const deleteCloudinaryPost = await cloudinary.uploader.destroy(public_id)

    const backendResponse = await axios.delete(`${process.env.BACKEND_URL}/post-api/post`,{
      headers:{
        "content-type":"application/json",
        Authorization:`Bearer ${token}`
      },
      data:{
        publicId:public_id
      }
    })
       
        
  console.log("backend response",backendResponse)
   

    // NextResponse.json(body, init?)
  
    return NextResponse.json({success:true,deleteCloudinaryPost})
  }catch(err){
    return NextResponse.json({error:"delete failed"},{status:500})
  }
}