import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface IAddAddress {
  Company: string;
  FirstName: string;
  LastName: string;
  Address1: string;
  Address2: string;
  CountryId: number;
  StateId: number;
  City: string;
  PostalCode: string;
  Email: string;
  PhoneNumber: string;
  FaxNumber: string;
  IsDefault: boolean;
}

export const getPreAddresses = () =>
  axios(`${BASE_URL}/api/custom/customer/Addresses`);

export const getCountries = () =>
  axios(`${BASE_URL}/api/custom/addresses/GetAvailableCountries`);

export const getStatesByCountry = (countryId: number) =>
  axios(`${BASE_URL}/api/custom/addresses/GetAvailableStates/${countryId}`);

export const getReturnProducts = () =>
  axios(`${BASE_URL}/api/custom/customer/ReturnRequests`);

export const getRewardPoints = () =>
  axios(`${BASE_URL}/api/custom/customer/RewardPoints`);

export const setDefulatAddress = ({id}: {id: number}) =>
  axios(`${BASE_URL}/api/custom/addresses/SetDefaultAddress`, {
    method: 'post',
    params: {id},
  });

export const addAddress = ({...rest}: IAddAddress) =>
  axios(`${BASE_URL}/api/custom/addresses/AddAddress`, {
    method: 'post',
    data: {
      ...rest,
    },
  });

export const deleteAddress = ({id}: {id: number}) =>
  axios(`${BASE_URL}/api/custom/addresses/DeleteAddress`, {
    method: 'post',
    params: {id},
  });
