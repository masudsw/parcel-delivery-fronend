export interface ISendOtp{
    email:string;
}

export interface IVerifyOtp{
    email:string;
    otp:string;
}

export interface IRegister{
    name:string;
    email:string;
    password:string;
    address:string;
    userType:string;
    phone:string;
}
export interface ILogin{
    email:string;
    password:string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  userType: string;     // "SENDER" | "RECEIVER" | etc.
  phone: string;
  isBlocked: boolean;
  isVarified: boolean;  // Note: typo "isVarified" matches your response
  address: string;
  auths: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface ILogin {
  email: string;
  password: string;
  userType:string;
}

export interface ILoginResponse {
  accessToken: string;  // Token is in response, not just cookies!
  user: IUser;
}