import react from "react"
import {useSelector} from "react-redux"

export  function useUser(){
    const { token, bio, username, profileImage, email, website, isPrivate,posts,userId } = useSelector((state: any) => state.user);
    return { token, bio, username, profileImage, email, website, isPrivate ,posts,userId};

}