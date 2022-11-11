import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getCheckoutAddresses = () => {
  return axios.get(`${BASE_URL}/api/custom/checkout/GetAddresses`);
};
