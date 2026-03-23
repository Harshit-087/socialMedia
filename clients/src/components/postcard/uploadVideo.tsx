import axios from "axios"

export async function UploadVideo(formdata:FormData){
    const video =  formdata.get("files") as File;
    const caption = formdata.get("caption") as string;
    const userId = formdata.get("userId") as string;

    //creating another formdata to send to cloudinary
    const signResponse =await axios.get("/api/cloudinary/signature")

    const cloudFormdata = new FormData();
    cloudFormdata.append("file",video)
    cloudFormdata.append("api_key",signResponse.data.api_key)
    cloudFormdata.append("timestamp",signResponse.data.timestamp)
    cloudFormdata.append("signature",signResponse.data.signature)

    // uploading to cloudinary 
    const cloudResponse =await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,cloudFormdata,
        {
            onUploadProgress:(e)=>{
                const progress = Math.round((e.loaded)*100/(e.total!))
                console.log("video upload progress",progress)
            }
        })
    // after successful upload to cloudinary , sending the video url to our backend
      const backendResponse =await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/video-api/uploadVideo`,{
        userId,
        caption,
        videoUrl:cloudResponse.data.secure_url,
        publicId:cloudResponse.data.public_id
      })

        return backendResponse;
}