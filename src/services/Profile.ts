import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getUserData = () =>
  axios.get(`${BASE_URL}/api/custom/customer/PersonalInfo`);
export const getWishlist = () =>
  axios.get(`${BASE_URL}/api/custom/customer/Wishlists`);
