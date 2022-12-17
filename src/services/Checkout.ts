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
interface ISubmitOrder {
  customerComments: string;
  packageAsGift: string;
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

export const submitOrder = ({
  customerComments,
  packageAsGift,
}: ISubmitOrder) => {
  if (!!customerComments.length && !!packageAsGift.length) {
    return axios.post(
      `${BASE_URL}/api/custom/checkout/SubmitOrder?customerComments=${customerComments}&packageAsGift=${packageAsGift}`,
    );
  } else if (!!customerComments.length) {
    return axios.post(
      `${BASE_URL}/api/custom/checkout/SubmitOrder?customerComments=${customerComments}`,
    );
  } else if (packageAsGift) {
    return axios.post(
      `${BASE_URL}/api/custom/checkout/SubmitOrder?packageAsGift=${packageAsGift}`,
    );
  }
};
