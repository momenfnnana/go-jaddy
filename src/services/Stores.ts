import axios, {AxiosResponse} from 'axios';
import {BASE_URL} from 'utils/Axios';

interface StoresParams {
  pageParam?: number;
  onlyFollowed?: boolean;
}

export const getAllStores = ({pageParam, onlyFollowed}: StoresParams) =>
  axios(`${BASE_URL}/api/custom/stores/AllStores`, {
    method: 'get',
    params: {page: pageParam, onlyFollowed},
  });
