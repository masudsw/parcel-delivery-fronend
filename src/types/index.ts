export type {ISendOtp,IVerifyOtp, IUser, ILogin, ILoginResponse,IRegister} from "./auth.types"

export interface IResponse<T>{
    statusCode:number;
    success:true;
    message:string;
    data:T, 
}