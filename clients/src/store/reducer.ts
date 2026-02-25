import { createSlice ,PayloadAction} from '@reduxjs/toolkit'

export interface userState{
    isLoggedIn:boolean,
    userId:string,
    username:string,
    role:string,
    email:string,
    isPrivate:boolean,
    profileImage:string,
    website:string,
    bio:string,
    token:string,
    
}

const initialState:userState={
    isLoggedIn:false,
    userId:"",
    username:"",
    role:"",
    email:"",
    isPrivate:false,
    profileImage:"",
    website:"",
    bio:"",
    token:"",
 
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        addSignup:(state,action: PayloadAction<{
        data: {
          username: string;
          role:string;
          email: string;
          isPrivate: boolean;
          token: string;
          profileImage: string;
          website: string;
          bio: string;
        };
      }>)=>{
            state.isLoggedIn=true;
            state.username=action.payload.data.username;
            state.role=action.payload.data.role;
            state.email=action.payload.data.email;
            state.isPrivate=action.payload.data.isPrivate;
             state.token=action.payload.data.token;
            state.profileImage=action.payload.data.profileImage;
            state.website=action.payload.data.website;
            state.bio=action.payload.data.bio;
            console.log("states",state)

           console.log("action payload",action.payload)

        },
        addLogin:(state,action)=>{
              state.isLoggedIn=true;
            state.token = action.payload.token;
            state.username=action.payload.username;
            state.role=action.payload.role;
            state.email=action.payload.email;
            state.isPrivate=action.payload.isPrivate;  
                 state.userId=action.payload._id;   
                 state.bio=action.payload.bio;
                 state.profileImage =action.payload.profileImage;
 
            //only work in client side ..
        if(typeof window !== "undefined"){
               localStorage.setItem("user",JSON.stringify({
                isLoggedIn:state.isLoggedIn,
                token:state.token,
                role:state.role,
                email:state.email,
                isPrivate:state.isPrivate,
                username:state.username
            }))
        }
        },
        addLogout:(state)=>{
            state.isLoggedIn=false;
            state.token="";
            state.username="";
            state.role="";
            state.email="";
            state.userId="",
            state.bio="",
            state.profileImage="",
            state.isPrivate=false;
           
            if(typeof window !=="undefined"){
            localStorage.removeItem("user")
            }
        },
        
         loginFromStorage:(state)=>{
            if(typeof window !== "undefined"){
           const stored= localStorage.getItem("user");
           if(stored){
            const userData= JSON.parse(stored);
            return {...state,...userData} // restore stored state
           }
        }
    },
      
    }
})

export const {addLogin,addSignup,addLogout,loginFromStorage} = userSlice.actions;
export default userSlice.reducer;