import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface IgetSearchResults {
  searchText: string;
  CurrencyId: string;
}
export const getStores = () =>
  axios(`${BASE_URL}/api/custom/stores/HomeStores`);

export const getSlider = () =>
  axios(`${BASE_URL}/api/custom/sliders?codes=Home_S_1,Home_S_2`);

export const getRecentAdded = () =>
  axios(`${BASE_URL}/api/custom/products/RecentlyAddedProducts`);

export const getProductDetails = (id: number) =>
  axios(`${BASE_URL}/api/custom/products/ProductDetails?productId=${id}`);

export const getAdvertisements = () =>
  axios(
    `${BASE_URL}/api/custom/advertisements?codes=Header_Navigation_Categories_One`,
  );

export const getBestSellers = () =>
  axios(`${BASE_URL}/api/custom/products/BestSellers`);

export const getSearchResults = ({searchText, CurrencyId}: IgetSearchResults) =>
  axios(`${BASE_URL}/api/custom/search/ByTerm?term=${searchText}`, {
    headers: {CurrencyId: CurrencyId},
  });
