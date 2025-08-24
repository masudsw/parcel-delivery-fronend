import { baseApi } from "@/redux/baseApi";


export const authApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        register:builder.mutation({
            query:(userInfo)=>({
                url:"/user/register",
                method:"POST",
                data:userInfo,
            })
            
        }),
        login:builder.mutation({
             query:(userInfo)=>({
                url:"auth/login",
                method:"POST",
                data:userInfo,
            })         
        }),
         logout:builder.mutation({
             query:()=>({
                url:"auth/logout",
                method:"POST",
            }),
            invalidatesTags:["USER"]         
        }),
        sendOtp:builder.mutation({
            query:(userInfo)=>({
                url:"/otp/send",
                method:"POST",
                data:userInfo,
            })
            
        }),
         verifyOtp:builder.mutation({
            query:(userInfo)=>({
                url:"/otp/verify",
                method:"POST",
                data:userInfo,
            })
            
        })
    })
})

export const{
    useRegisterMutation,
    useLoginMutation,
    useSendOtpMutation,
    useVerifyOtpMutation

}=authApi