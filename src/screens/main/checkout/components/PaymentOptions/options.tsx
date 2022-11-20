import {ReactNode} from 'react';
import CardsForms from './CardsForms';
interface IPaymentOptions {
  id: number;
  title: string;
  component: ReactNode | null;
}
export const paymentOptions: IPaymentOptions[] = [
  {
    id: 1,
    title: 'checkout.payment-options.cash',
    component: null,
  },
  {
    id: 2,
    title: 'checkout.payment-options.in-store',
    component: null,
  },
  // {
  //   id: 3,
  //   title: 'checkout.payment-options.visa-master-card',
  //   component: <CardsForms />,
  // },
];
