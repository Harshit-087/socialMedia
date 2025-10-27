"use client"
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import {Provider} from "react-redux"
import {store} from "../store/store"
import {PersistGate} from "redux-persist/integration/react"
import {persistor} from "@/store/store"
import {Toaster} from "react-hot-toast"

export default function TanProvider({children}:{children:React.ReactNode}){
    
    const queryClient = new  QueryClient()
    return(
        <>
       <Provider store={store}>
        {/* it calls redux.rehydrate internally  & waits until rehydration finishes */}
       <PersistGate loading={null} persistor={persistor}>
         <QueryClientProvider client={queryClient}>
          
        {children}
        <Toaster 
            position="top-right"
            toastOptions={{
              success: {style:{background:"green",color:"white"}},
              error:{style:{background:"red",color:"white"}}
            }}
            />
        </QueryClientProvider>
        </PersistGate>
      </Provider>
        </>
    )
}