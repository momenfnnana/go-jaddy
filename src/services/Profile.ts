import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface IchangeUserInfo {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
  AvatarId?: number | undefined;
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
