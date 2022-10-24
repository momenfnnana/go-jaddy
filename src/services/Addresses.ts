import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

export const getPreAddresses = () =>
  axios(`${BASE_URL}/api/custom/customer/Addresses`);

export const getReturnProducts = () =>
  axios(`${BASE_URL}/api/custom/customer/ReturnRequests`);

export const getRewardPoints = () =>
  axios(`${BASE_URL}/api/custom/customer/RewardPoints`);

export const setDefulatAddress = ({id}: {id: number}) =>
  axios(`${BASE_URL}/api/custom/addresses/SetDefaultAddress`, {
    method: 'post',
    params: {id},
  });

export const deleteAddress = ({id}: {id: number}) =>
  axios(`${BASE_URL}/api/custom/addresses/DeleteAddress`, {
    method: 'post',
    params: {id},
  });
