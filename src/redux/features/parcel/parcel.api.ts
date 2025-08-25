import { baseApi } from "@/redux/baseApi";
import type {  IParcel, IResponse } from "@/types";


export const parcelApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        createParcel:builder.mutation<IResponse<IParcel>,IParcel>({
            query:(parcelInfo)=>({
                url:"/parcel/newparcel",
                method:"POST",
                data:parcelInfo,
            })
            
        }),
       
       
        
        userInfo:builder.query({
            query:()=>({
                url:"/user/me",
                method:"GET",
            }),
            providesTags:["PARCEL"],
        })
    })
})

export const{
    
  useCreateParcelMutation

}=parcelApi