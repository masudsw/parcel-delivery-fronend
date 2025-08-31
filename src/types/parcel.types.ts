import type { TCurrentStatus } from "@/constants/parcelStatus";
import type { string } from "zod";
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
export interface IGetAllParcelsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: IPaginationMeta;
  data: IParcelBase[];
}

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
export interface IParcelBase {
  _id?: string;
  trackingId?: string;
  sender?: string;
  receiverName: string;
  receiverPhone: string;
  originAddress: IAddressFormat;
  destinationAddress: IAddressFormat;
  description: string;
  weight?: number;
  dimentions?: IDimentions;
  currentStatus?: TCurrentStatus;
  statusLogs?: IStatusLog[];
}
export interface IAdminParcel extends IParcelBase {
  shippingFee: number;
  estimatedDeliveryDate: Date;
  notes?: string;
}

export interface ISenderParcel {
  // Only the fields sender is allowed to provide
  _id?:string;
  receiverName: string;
  receiverPhone: string;
  originAddress: IAddressFormat;
  destinationAddress: IAddressFormat;
  description: string;
  weight?: number;
  dimentions?: IDimentions;
  // NO backend-only fields like statusLogs, currentStatus, etc.
}

export interface IStatusUpdateResponse {
  success: boolean;
  message: string;
  data?: IParcelBase;
}
export interface IPickupData {
  receiverName: string;
  receiverPhone: string;
  destinationAddress: {
    address: string;
    district: string;
    country: string;
  };
  estimatedDeliveryDate: string; // ISO string
  weight: number;
  notes?: string;
  shippingFee: number;
}



export interface IGetAllParcelsParams {
  searchTerm?: string;       
  currentStatus?: TCurrentStatus;
  sort?: string;             
  limit?: number;
  page?: number;
  minCost?: number;
  maxCost?: number;
  fields?: string;           // backend expects string like "receiverName,trackingId"
}