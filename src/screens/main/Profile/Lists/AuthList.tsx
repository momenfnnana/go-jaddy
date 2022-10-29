import {ProfileIconTab} from 'assets/icons';
import {ITab} from './UnAuthList';

export const data: ITab[] = [
  {
    id: 1,
    title: 'profile.account-details',
    icon: <ProfileIconTab />,
    goTo: 'ProfileDetails',
  },
  {
    id: 2,
    title: 'profile.request-list',
    icon: <ProfileIconTab />,
  },
  {
    id: 3,
    title: 'profile.payment-information',
    icon: <ProfileIconTab />,
  },
  {
    id: 4,
    title: 'profile.previous-titles',
    icon: <ProfileIconTab />,
    goTo: 'PreviousTitles',
  },
  {
    id: 5,
    title: 'profile.return-products',
    goTo: 'ReturnProducts',
    icon: <ProfileIconTab />,
  },
  {
    id: 6,
    title: 'profile.score-balance',
    goTo: 'CustomerPoints',
    icon: <ProfileIconTab />,
  },
];
