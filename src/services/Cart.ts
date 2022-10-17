import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getCartProducts = () =>
  axios(`${BASE_URL}/api/custom/cart/GetCart`);
