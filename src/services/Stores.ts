import axios, {AxiosResponse} from 'axios';
import {BASE_URL} from 'utils/Axios';

interface StoresParams {
  pageParam?: number;
  onlyFollowed?: boolean;
}

export const getAllStores = ({pageParam = 1}: StoresParams) =>
  axios(`${BASE_URL}/api/custom/stores/AllStores?page=${pageParam}`);
