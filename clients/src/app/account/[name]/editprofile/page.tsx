"use client"
import {useState} from "react"
import {useQuery,useMutation} from "@tanstack/react-query"
import { useUser } from "@/hooks/userhook"
import { userQuery } from "@/app/api/userQuery"
import {useDispatch} from "react-redux"

export default function EditProfile(){
    const {userId,email} = useUser()
    const dispatch = useDispatch();
    const [formData,setFormData]=useState({
        name:"",
        email:email,
        bio:"",
        website:""
    })

    const {data:editProfile={},isLoading,error}=useQuery({
        queryKey:["userProfile",userId],
        queryFn:async({queryKey})=>{
            const [_,id ] =queryKey as [string ,string]
            const res= await userQuery.fetchProfile(id);
            return res.data?.data;
        }
    })

 
    const editProfileMutation = useMutation({
        mutationFn:async({name,email,bio,website}:{name:string,email:string,bio:string,website:string})=>{
            return await userQuery.editProfile(name,email,bio,website);
        },
        onSuccess:(res)=>{
            console.log("Profile edited successfully",res);
        },
        onError:(err)=>{
            console.log("Error editing profile",err);
        }
    })

    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        console.log("input change",formData)
        setFormData(prev=>({...prev,[name]:value}))
    }

    const handleSubmit=(e:any)=>{
        e.preventDefault();
        //handle form submission logic here
        editProfileMutation.mutate(formData);
        
    }
    return(
        <>
         <div className="bg-gray-600 h-screen w-screen border-2 flex justify-center items-center">
            <div className=" w-72 mx-auto h-1/2 bg-white border-2 border-gray-800 ">
            <form 
            onSubmit={(e)=>handleSubmit(e)}
            encType="multipart/form-data">
                <label htmlFor="name">Username</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(e)} className="border-2 border-gray-400 w-full mb-4"/>
                  <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={formData.email} className="border-2 border-gray-400 w-full mb-4" defaultValue={email} readOnly/>
                 
                <label htmlFor="bio">Bio</label>
                <input type="text" name="bio" id="bio" value={formData.bio} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(e)} className="border-2 border-gray-400 w-full mb-4"/>   
                 <label htmlFor="website">Website</label>
                <input type="text" name="website" id="website" value={formData.website} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>handleInputChange(e)} className="border-2 border-gray-400 w-full mb-4"/>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save Changes</button>
            </form>
            </div>

         </div>
        </>
    )
}