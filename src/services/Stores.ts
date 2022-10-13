import axios, {AxiosResponse} from 'axios';
import {BASE_URL} from 'utils/Axios';

interface StoresParams {
  pageParam?: number;
  onlyFollowed?: boolean;
  storeId?: boolean;
}

interface StoreDetailsParams {
  storeId: number | any;
  pageParam?: number;
}

interface IgetReviewStore {
  storeId: number | string | any;
  WithImageOnly: boolean;
  Ratings?: number[] | string[];
  pageParam?: number;
}

export const getAllStores = ({
  pageParam = 1,
  onlyFollowed = false,
}: StoresParams) =>
  axios(`${BASE_URL}/api/custom/stores/AllStores`, {
    params: {page: pageParam, onlyFollowed: onlyFollowed},
  });

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
  );

export const getStoreOfferProducts = ({
  pageParam = 1,
  storeId,
}: StoreDetailsParams) =>
  axios(
    `${BASE_URL}/api/custom/stores/StoreHasDiscountProducts?storeId=${storeId}&page=${pageParam}&pageSize=10`,
  );

interface StoreSearchParams {
  storeId: number | any;
  pageParam?: number;
  term: string;
}

export const getStoreSearchProducts = ({
  pageParam = 1,
  storeId,
  term,
}: StoreSearchParams) =>
  axios(`${BASE_URL}/api/custom/stores/SearchInStore`, {
    params: {
      page: pageParam,
      storeId,
      term,
      pageSize: 10,
    },
  });

export const getStoreReviews = ({
  pageParam = 1,
  storeId,
  Ratings,
  WithImageOnly,
}: IgetReviewStore) =>
  axios(`${BASE_URL}/api/custom/stores/StoreReviews`, {
    method: 'post',
    data: {
      Page: pageParam,
      PageSize: 5,
      storeId,
      Ratings,
      WithImageOnly,
    },
  });

interface IRefreshFollowStore {
  storeId: number;
  isFollow: boolean;
}

export const getRefreshFollowStore = ({
  storeId,
  isFollow,
}: IRefreshFollowStore) =>
  axios(`${BASE_URL}/api/custom/stores/RefreshFollowStatus`, {
    method: 'post',
    params: {
      id: storeId,
      isFollow,
    },
  });
