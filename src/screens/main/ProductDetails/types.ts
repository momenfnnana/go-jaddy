import {Ifiltter} from 'screens/main/StoreDetails/StoreDetails';
export type AttributesTypes =
  | 'Boxes'
  | 'DropdownList'
  | 'RadioList'
  | 'Checkboxes'
  | 'TextBox';
export interface IListHeaderComponent {
  Product: any;
  ProductId: number;
  selectedFilter: Ifiltter;
  setSelectedFilter: (value: any) => void;
  ratingFilters: string[];
  setRatingFilters: (value: any) => void;
  isRefetchingReviews: boolean;
  isLoadingReviews: boolean;
  reviewsList: any[];
}
export interface IAttributes {
  AttributeControlType?: AttributesTypes;
  AttributeId?: number;
  DisplayOrder?: number;
  IsMultipleChoice?: boolean;
  IsRequired?: boolean;
  isSelected?: boolean;
  Name?: string;
  Values?: any[];
  VariantAttributeId?: number;
}
export interface ISelectAttribute {
  attributeValue?: any[];
  attribute?: number;
}
export interface ISelectAttributeHandler {
  attribute: IAttributes;
  attributeValue: any;
}
export interface ICheckIncludedItem {
  item: ISelectAttribute;
  array: ISelectAttribute[];
}

export enum productCounter {
  increase,
  descrease,
}
