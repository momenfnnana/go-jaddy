import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getStores = () => {
  return axios(`${BASE_URL}/api/custom/stores/HomeStores`);
};

export const getProductDetails = (id: number) => {
  return axios(
    `${BASE_URL}/api/custom/products/ProductDetails?productId=${id}`,
  );
};
