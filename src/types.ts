interface ICurrency {
  Symbol: string;
  Name: string;
  Id: number;
  ISOCode: string;
}

interface ImageData {
  Id: number;
  ThumbUrl: string;
  Title: string;
  Url: string;
}
interface IAddress {
  Id: number;
  Company: string;
  FirstName: string;
  LastName: string;
  Address1: string;
  Address2: string;
  CountryId: number;
  CountryName: string;
  City: string;
  Email: string;
  PhoneNumber: string;
  FaxNumber: string;
  StateId: string;
  IsDefault: boolean;
}
export const CART = 'CART';
export type {ICurrency, ImageData, IAddress};
