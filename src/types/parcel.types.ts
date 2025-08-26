import type { TCurrentStatus } from "@/constants/parcelStatus";


export interface IAddress {
  address: string;
  district: string;
  country: string;
}


export interface IDimentions{
    length?:number;
    width?:number;
    height?:number;
}
export interface IStatusLog{
    status:TCurrentStatus
    timestamp:Date,
    location:string,
    notes?:string
}

export interface IAddressFormat{
    address:string,
    district:string,
    country:string
}
export interface IParcel{
    _id?:string;
    trackingId?:string,
    sender?:string;
    receiverName:string;
    receiverPhone:string;
    originAddress:IAddressFormat;
    destinationAddress:IAddressFormat;
    description:string,
    shippingFee?:number,
    estimatedDeliveryDate?:Date,
    currentStatus?:TCurrentStatus,
    weight?:number;
    dimentions:IDimentions;
    statusLogs?:IStatusLog[]
}

export interface IStatusUpdateResponse {
  success: boolean;
  message: string;
  data?: IParcel;
}

export interface IGetAllParcelsParams {
  currentStatus?: TCurrentStatus;
  sort?: string;
  limit?: number;
  page?: number;
  minCost?: number;
  maxCost?: number;
  fields?: string;
}