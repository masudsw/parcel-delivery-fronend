

export interface IAddress {
  address: string;
  district: string;
  country: string;
}

export interface IDimensions {
  height: number;
  width: number;
  length: number;
}

export interface IParcel {
  receiverName: string;
  receiverPhone: string;
  originAddress: IAddress;
  destinationAddress: IAddress;
  dimentions: IDimensions;
  description: string;
  weight: number;
}