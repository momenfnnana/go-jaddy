import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface IgetSearchResults {
  searchText: string;
  CurrencyId: string;
}
interface IgetReviews {
  ProductId: number | string;
  PageSize: number | string;
  WithImageOnly: boolean;
  Ratings?: number[] | string[];
  pageParam?: number;
}
export const getStores = () =>
  axios(`${BASE_URL}/api/custom/stores/HomeStores`);

export const getSlider = () =>
  axios(`${BASE_URL}/api/custom/sliders?codes=Home_S_1,Home_S_2`);

export const getRecentAdded = () =>
  axios(`${BASE_URL}/api/custom/products/RecentlyAddedProducts`);

export const getProductDetails = (id: number) =>
  axios(`${BASE_URL}/api/custom/products/ProductDetails?productId=${id}`);

export const getReviews = ({
  pageParam = 1,
  ProductId,
  Ratings,
  WithImageOnly,
}: IgetReviews) =>
  axios(`${BASE_URL}/api/custom/products/ProductReviews`, {
    method: 'post',
    data: {
      Page: pageParam,
      PageSize: 5,
      ProductId,
      Ratings,
      WithImageOnly,
    },
  });

export const getWishlists = () =>
  axios(`${BASE_URL}/api/custom/customer/Wishlists`);

export const postCreateWishlist = (name: string) =>
  axios.post(`${BASE_URL}/api/custom/wishlist/CreateWishlist?name=${name}`);

export const postAddToWishlist = (data: any) =>
  axios.post(`${BASE_URL}/api/custom/wishlist/AddToWishlist`, data);

export const subscribeProduct = (id: number) =>
  axios.post(`${BASE_URL}/api/custom/products/BackInStockSubscribe?id=${id}`);

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

export const getIpAddress = () => axios(`https://geolocation-db.com/json/`);

export const postAddReview = (data: any) =>
  axios.post(`${BASE_URL}/api/custom/products/AddProductReview`, data);
