import {ReactNode} from 'react';
import {ImageBackgroundProps, ImageSourcePropType} from 'react-native';

export interface ICategories {
  imageUrl: ImageSourcePropType;
  name: string;
}
export interface IProductInterface {
  Id: number;
  isFav: boolean;
  title: string;
  acttualPrice: string;
  prevPrice: string;
  currency: string;
  rate: number;
  productColors: string[];
  isNews: boolean;
  isHaveDiscount: boolean;
  discountValue: string;
  imageUrl: ImageSourcePropType;
  Image: any;
  Price: any;
  Badges: any[];
  AddedToCart: any;
  Name: string;
  RatingSum: any;
  CategoryName: string;
  SupportMultiWishlists: string;
  WishlistEnabled: boolean;
}

export interface ISearchInterface {
  categoryId?: number;
  title?: string;
  paramsType?: string;
}
