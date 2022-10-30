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

export type {ICurrency, ImageData};
