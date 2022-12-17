import {ProfileIconTab} from 'assets/icons';
import {ITab} from './UnAuthList';

export const data = ({userType}: {userType?: string}): ITab[] => {
  if (userType == 'Seller') {
    return [
      {
        id: 0,
        title: 'profile.products-list',
        icon: <ProfileIconTab />,
        goTo: 'OrdersList',
        params: {isOrederRequest: true},
      },
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
        goTo: 'OrdersList',
      },
      {
        id: 3,
        title: 'profile.purchases-list',
        icon: <ProfileIconTab />,
        goTo: 'OrdersList',
        params: {isOrederRequest: false},
      },
      // {
      //   id: 4,
      //   title: 'profile.payment-information',
      //   icon: <ProfileIconTab />,
      // },
      {
        id: 5,
        title: 'profile.previous-titles',
        icon: <ProfileIconTab />,
        goTo: 'PreviousTitles',
      },
      {
        id: 6,
        title: 'profile.return-products',
        goTo: 'ReturnProducts',
        icon: <ProfileIconTab />,
      },
      {
        id: 7,
        title: 'profile.score-balance',
        goTo: 'CustomerPoints',
        icon: <ProfileIconTab />,
      },
    ];
  } else {
    return [
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
        goTo: 'OrdersList',
      },
      // {
      //   id: 3,
      //   title: 'profile.payment-information',
      //   icon: <ProfileIconTab />,
      // },
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
  }
};
