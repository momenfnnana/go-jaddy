export {default as CheckoutHeader} from './CheckoutHeader';
export {default as CheckoutStepOne} from './CheckoutStepOne';
export {default as CheckoutStepTwo} from './CheckoutStepTwo';
export {default as CheckoutStepThree} from './CheckoutStepThree';
export {default as CheckoutStepFour} from './CheckoutStepFour';

export interface ICheckoutStep {
  setActiveStep?: any;
}
