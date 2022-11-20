import axios from 'axios';
import {BASE_URL} from 'utils/Axios';

interface ISelectBillingAddress {
  addressId: number;
  isBillingAddress: boolean;
}

interface ISelectShippingMethod {
  Name: string;
  ShippingRateComputationMethodSystemName: string;
}
interface ISelectPaymentMethod {
  paymentMethod: string;
}

export const getCheckoutAddresses = () => {
  return axios.get(`${BASE_URL}/api/custom/checkout/GetAddresses`);
};

export const getCheckoutMethods = () => {
  return axios.get(`${BASE_URL}/api/custom/checkout/GetShippingMethods`);
};

export const selectBillingAddress = ({
  addressId,
  isBillingAddress,
}: ISelectBillingAddress) => {
  return axios.post(
    `${BASE_URL}/api/custom/checkout/SelectAddress?addressId=${addressId}&isBillingAddress=${isBillingAddress}`,
  );
};

export const selectShippingMethod = ({
  Name,
  ShippingRateComputationMethodSystemName,
}: ISelectShippingMethod) => {
  return axios.post(
    `${BASE_URL}/api/custom/checkout/SelectShippingMethod?shippingOption=${Name}___${ShippingRateComputationMethodSystemName}`,
  );
};

export const getPaymentMethods = () => {
  return axios.get(`${BASE_URL}/api/custom/checkout/GetPaymentMethods`);
};

export const selectPaymentMethod = ({paymentMethod}: ISelectPaymentMethod) => {
  return axios.post(
    `${BASE_URL}/api/custom/checkout/SelectPaymentMethod?paymentMethod=${paymentMethod}`,
  );
};
