import type { ComponentType } from "react";

export type {ISendOtp,IVerifyOtp, IUser, ILogin, ILoginResponse,IRegister} from "./auth.types"
export type {IAdminParcel, ISenderParcel,IParcelBase,IStatusLog,IGetAllParcelsResponse} from "./parcel.types"

export interface IResponse<T>{
    statusCode:number;
    success:true;
    message:string;
    data:T, 
}

export interface ISidebarItem{
    title:string;
    items:{
        title:string;
        url:string;
        component:ComponentType
    }[]
}

export type TUserType="ADMIN"|"SENDER"|"RECEIVER";