import axios, {AxiosResponse} from 'axios';
import {BASE_URL} from 'utils/Axios';

interface CategoriesParams {
  pageParam?: any;
  categoryId?: number;
  StoreId?: number;
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

export const getCategoryProducts = ({
  pageParam = 1,
  categoryId,
  StoreId,
}: CategoriesParams) =>
  axios(`${BASE_URL}/api/custom/category/CategoryProducts`, {
    method: 'post',
    data: {
      CategoryId: categoryId,
      Term: '',
      Page: pageParam,
      PageSize: 5,
      StoreId,
    },
  });
