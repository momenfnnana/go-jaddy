import axios, {AxiosResponse} from 'axios';
import {BASE_URL} from 'utils/Axios';

interface StoresParams {
  pageParam?: number;
  onlyFollowed?: boolean;
  storeId?: boolean;
}

interface StoreDetailsParams {
  storeId: number & any;
  pageParam?: number;
}

export const getAllStores = ({pageParam = 1}: StoresParams) =>
  axios(`${BASE_URL}/api/custom/stores/AllStores?page=${pageParam}`);

export const getStoreDetails = ({storeId = 1}: StoreDetailsParams) =>
  axios(`${BASE_URL}/api/custom/stores/StoreDetials?storeId=${storeId}`);

export const getStoreCategories = ({
  pageParam = 1,
  storeId,
}: StoreDetailsParams) =>
  axios(`${BASE_URL}/api/custom/stores/StoreCategories`, {
    params: {storeId, page: pageParam},
  });

export const getStoreNewProducts = ({
  pageParam = 1,
  storeId,
}: StoreDetailsParams) =>
  axios(
    `${BASE_URL}/api/custom/stores/StoreNewProducts?storeId=${storeId}&page=${pageParam}&pageSize=10`,
    {
      // params: {storeId, page: pageParam, pageSize: 10},
    },
  );
