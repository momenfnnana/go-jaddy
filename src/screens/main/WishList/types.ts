import {ReactNode} from 'react';
interface ITop4Products {
  DetailUrl?: string;
  Id: number;
  localImage?: ReactNode;
  Image?: {
    Id?: number;
    ThumbUrl?: string;
    Title?: string;
    Url?: string;
  };
  Name?: string;
  ShortDescription?: string;
}
interface IWishListItem {
  Name: string;
  CreatedOn: Date;
  Id: number;
  ModifiedOn: Date;
  Top4Products: ITop4Products[];
  WishlistLinesCount: number;
  refreshItems: () => void;
  removeEmptyItem?: () => void;
}
export type {ITop4Products, IWishListItem};
