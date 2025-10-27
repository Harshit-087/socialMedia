import react from "react"
import {useSelector} from "react-redux"
import type {RootState} from "../store/store"

export  function useUser(){
    const { token, bio, username, profileImage, email, website, isPrivate,userId } = useSelector((state: RootState) => state.user);
    return { token, bio, username, profileImage, email, website, isPrivate ,userId};

}