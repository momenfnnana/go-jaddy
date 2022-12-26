import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface IAttributes {
  AttributeId: number;
  VariantAttributeId?: number;
  AttributeValueId: number;
}

interface IAddCartItem {
  ProductId: number;
  QuantityToAdd: number;
  SelectedAttributes?: any[];
}

interface IEditCartItem {
  itemId: number;
  newQuantity: number;
}

export const getCartProducts = () =>
  axios(`${BASE_URL}/api/custom/cart/GetCart`);

export const getCartSummary = () =>
  axios(`${BASE_URL}/api/custom/cart/GetCartSummary`, {
    method: 'post',
  });

export const addCartProducts = (data: IAddCartItem[]) => {
  const body = {
    Items: data,
  };
  return axios(`${BASE_URL}/api/custom/cart/AddCartItems`, {
    method: 'post',
    data: body,
  });
};

export const editCartProducts = ({itemId, newQuantity}: IEditCartItem) =>
  axios(`${BASE_URL}/api/custom/cart/UpdateCartItem`, {
    method: 'post',
    params: {itemId, newQuantity},
  });

export const removeCartProducts = (itemId: number) =>
  axios(`${BASE_URL}/api/custom/cart/DeleteCartItem`, {
    method: 'post',
    params: {itemId},
  });

export const applyDiscountCart = (discountPromoCode: string) =>
  axios(`${BASE_URL}/api/custom/cart/ApplyDiscountCoupon`, {
    method: 'post',
    params: {discountPromoCode},
  });

export const removeDiscountCart = () =>
  axios(`${BASE_URL}/api/custom/cart/RemoveDiscountCoupon`, {
    method: 'post',
  });

export const togglePointsCart = (useRewardPoints: boolean) =>
  axios(`${BASE_URL}/api/custom/cart/ApplyRewardPoints`, {
    method: 'post',
    params: {useRewardPoints},
  });
