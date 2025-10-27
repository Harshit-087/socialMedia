"use client"
import {X} from "lucide-react"
import {useState,useEffect} from "react"
import axios from "axios"
import {useUser} from "@/hooks/userhook"
import {useDispatch} from "react-redux"
// import {uploadImage} from "@/store/reducer"
import {postQuery} from "@/app/api/postQuery"
import {useMutation} from "@tanstack/react-query"
import imagecompression from "browser-image-compression"
import {useQueryClient} from "@tanstack/react-query"
import {Progress} from "@/components/ui/progress"
import  toast from "react-hot-toast"

export default function UploadPost({onClose}:{onClose:()=>void}){

    const dispatch = useDispatch();
  const {userId,token} = useUser()
const [progress , setProgress] =useState<number>(12)
const queryClient = useQueryClient();

  useEffect(()=>{
    const timer =  setTimeout(() => {
      setProgress((prev)=>prev+25)
    },5000);
 
    return (()=>{
  
      clearTimeout(timer)
    // setProgress(12)
  }
    );
  },[progress])

    const uploadMutation = useMutation({
        mutationFn:async({data,userId,token}:{data:FormData,userId:string,token:string})=>{
            return await postQuery.uploadPost(data,userId,token)
        },
        onSuccess:(res)=>{
             toast.success(res.data.msg)
            queryClient.invalidateQueries({queryKey:["posts",userId]})
            onClose();
        },
        onError:(err)=>{
            console.log("upload error post",err)
        }
    })

    const handleSubmit= async(e:React.FormEvent)=>{
       e.preventDefault()
       const value=(e.currentTarget as HTMLFormElement).pictures as HTMLInputElement;
       const file = value.files?.[0];
       console.log("value target",value)
       if(!file) return;
   

      const caption = (e.currentTarget as HTMLFormElement).caption as HTMLTextAreaElement;
      console.log("caption",caption.value)

        // the broswer automatically sets the correct headers for multipart/form-data including the boundary
        // file is send {} to backend , if direclty sent it will be sent as [object object]
        // to send file we need to use formdata
         const formData = new FormData();

         //compressing image before sending to the cloudinary to reduce upload time ..
         const compressedFile = await imagecompression(file,{maxSizeMB:1})
         formData.append("pictures", compressedFile);
         formData.append("caption",caption.value)
        
          // dispatch(uploadImage(file.name))
          uploadMutation.mutate({ data: formData, userId, token })
       
     
       
    }
    return(
        <>
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
  <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
    
    {/* Close button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
    >
      <X className="text-gray-600" />
    </button>

    {/* Header */}
    <div className="text-center py-6 px-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">Upload Your Image</h2>
      <p className="text-gray-500 mt-1 text-sm">Choose a file to share with the community</p>
    </div>

    {uploadMutation.isPending? <Progress value={progress} className="w-[80%] mx-auto text-blue-200"/>:null}

  
    {/* Upload form */}
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-6 py-6 px-8"
    >
      <label
        htmlFor="postImage"
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition"
      >
        <span className="text-gray-400 text-lg">Click or drag to upload</span>
        <input
          type="file"
          id="postImage"
          name="pictures"
          accept="image/*"
          className="hidden"
        />
      </label>

      <label htmlFor="captionText" className="mx-auto w-full translate-y-5">write a caption </label>
        <textarea
          id="captionText"
          name="caption"   
          className="border text-black border-gray-400 rounded-md p-2 w-full whitespace-normal break-words focus:outline-none focus:ring-0"
         rows={3}
        placeholder="e.g blooming, flower"
       ></textarea>

      
      <button
        type="submit"
        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition"
      >
        Upload
      </button>
    </form>
  </div>
</div>


        </>)}