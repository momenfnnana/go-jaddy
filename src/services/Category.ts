import axios, {AxiosResponse} from 'axios';
import {BASE_URL} from 'utils/Axios';

interface CategoriesParams {
  pageParam?: any;
  categoryId?: number;
}

export const getPerantCategories = ({pageParam = 1}) => {
  return axios(
    `${BASE_URL}/api/custom/category/ParentCategories?pageSize=10&page=${pageParam}`,
  );
  // return res.data;
};

export const getSubCategories = ({
  pageParam = 1,
  categoryId,
}: CategoriesParams) =>
  axios(
    `${BASE_URL}/api/custom/category/SubCategories?categoryId=${categoryId}&pageSize=10&page=${pageParam}`,
  );
