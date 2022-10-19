import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface IAddCartItem {
  productId: number;
  quantityToAdd: number;
}

interface IEditCartItem {
  itemId: number;
  newQuantity: number;
}

export const getCartProducts = () =>
  axios(`${BASE_URL}/api/custom/cart/GetCart`);

export const addCartProducts = ({productId, quantityToAdd}: IAddCartItem) =>
  axios(`${BASE_URL}/api/custom/cart/AddCartItem`, {
    method: 'post',
    params: {productId, quantityToAdd},
  });

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
