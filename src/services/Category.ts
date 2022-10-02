import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface CategoriesParams {
  pageSize: number;
  page: number;
}

export const getPerantCategories = (params: CategoriesParams) =>
  axios(`${BASE_URL}/api/custom/category/ParentCategories`, {params});

export const getSubCategories = (params: CategoriesParams) =>
  axios(`${BASE_URL}/api/custom/category/SubCategories`, {params});
