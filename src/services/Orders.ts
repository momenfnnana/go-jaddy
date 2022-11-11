import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getStoreOrders = ({pageParam = 1}: {pageParam: number}) =>
  axios(
    `${BASE_URL}/api/custom/customer/StoreOrders?pageSize=10&page=${pageParam}`,
  );
