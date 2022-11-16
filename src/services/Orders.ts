import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getStoreOrders = ({
  pageParam = 1,
  orderNumber,
}: {
  pageParam: number;
  orderNumber?: string;
}) =>
  axios(`${BASE_URL}/api/custom/customer/StoreOrders`, {
    params: {
      pageSize: 10,
      page: pageParam,
      orderNumber,
    },
  });

export const getCustomerOrders = ({
  pageParam = 1,
  orderNumber,
}: {
  pageParam: number;
  orderNumber?: string;
}) =>
  axios(`${BASE_URL}/api/custom/customer/Orders`, {
    params: {
      pageSize: 10,
      page: pageParam,
      orderNumber,
    },
  });

export const getOrdersDetails = ({orderId}: {orderId?: string}) =>
  axios(`${BASE_URL}/api/custom/order/details?id=${orderId}`);
