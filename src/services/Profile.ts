import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface IchangeUserInfo {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
  AvatarId?: number | undefined;
}

interface IchangePassword {
  OldPassword?: string;
  NewPassword?: string;
  ConfirmNewPassword?: string;
}

interface IGetWishlistDetails {
  pageParam: number;
  Id: number;
}
export const getUserData = () =>
  axios.get(`${BASE_URL}/api/custom/customer/PersonalInfo`);

export const getWishlist = () =>
  axios.get(`${BASE_URL}/api/custom/customer/Wishlists`);

export const uploadAvatar = (data: any) => {
  return axios.post(`${BASE_URL}/api/custom/customer/UploadAvatar`, data);
};

export const changeUserInfo = ({
  FirstName,
  LastName,
  Email,
  PhoneNumber,
  AvatarId,
}: IchangeUserInfo) =>
  axios(`${BASE_URL}/api/custom/customer/ChangePersonalInfo`, {
    method: 'post',
    data: {
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      AvatarId,
    },
  });

export const changePassword = ({
  OldPassword,
  NewPassword,
  ConfirmNewPassword,
}: IchangePassword) =>
  axios(`${BASE_URL}/api/custom/customer/ChangePassword`, {
    method: 'post',
    data: {
      OldPassword,
      NewPassword,
      ConfirmNewPassword,
    },
  });
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

export const getTopics = () => {
  return axios(`${BASE_URL}/api/custom/topic/Topics`);
};

export const getTopicDetails = ({id}: {id: number}) => {
  return axios(`${BASE_URL}/api/custom/topic/TopicDetails?id=${id}`);
};
