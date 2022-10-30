import axios from 'axios';
import {BASE_URL} from 'utils/Axios';
interface IGetWishlistDetails {
  pageParam: number;
  Id: number;
}
export const getUserData = () =>
  axios.get(`${BASE_URL}/api/custom/customer/PersonalInfo`);
export const getWishlist = () =>
  axios.get(`${BASE_URL}/api/custom/customer/Wishlists`);
export const getWishlistDetails = ({
  pageParam = 1,
  Id,
}: IGetWishlistDetails) => {
  return axios(
    `${BASE_URL}/api/custom/wishlist/GetWishlist?id=${Id}&page=${pageParam}`,
  );
};
export const deleteWishlistItem = (itemId: number) => {
  return axios.post(
    `${BASE_URL}/api/custom/wishlist/DeleteWishlistLine?itemId=${itemId}`,
  );
};
