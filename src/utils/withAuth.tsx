import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TUserType } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router-dom";

export const withAuth=(Component:ComponentType, requiredUserType?:TUserType)=>{
    return function AuthWrapper(){
        const {data, isLoading}=useUserInfoQuery(undefined);
        if(!isLoading && !data?.data?.email){
            return <Navigate to="/login"/>
        }
        if(requiredUserType && !isLoading && requiredUserType!==data?.data?.userType){
            return <Navigate to="/unauthorized"/>;
        }
        return <Component/>

    }
}