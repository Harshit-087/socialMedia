import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./reducer"
import storage from  "redux-persist/lib/storage"
import {persistReducer,persistStore} from "redux-persist"

const persistConfig={
    key:"root",  // key for local storage
    storage,     
}
//handles saving (persist) 
const persistReducerUser = persistReducer(persistConfig,userSlice)

export const store = configureStore({
    reducer:{
         user:persistReducerUser
    },
    middleware:(getDefaultMiddleware)=>(
        getDefaultMiddleware({
            serializableCheck:false
        })
    )
})

// for rehydrating from localstorage , creates the persistor and handles rehydration
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
