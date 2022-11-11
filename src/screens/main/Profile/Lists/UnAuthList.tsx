import {ProfileIconTab} from 'assets/icons';
import {DropDown, SwitchLang} from 'components';
import {ProfileRoutes} from 'navigators/RoutesTypes';
import WantTalkSection from '../components/WantTalkSection';
interface IRightIconInputs {
  text: string;
}

export interface ITab {
  id: number;
  title: string;
  icon: JSX.Element;
  RightIcon?: ({text}: IRightIconInputs) => JSX.Element;
  bottomSection?: JSX.Element;
  goTo?:
    | 'Profile'
    | 'WishList'
    | 'PreviousTitles'
    | 'ReturnProducts'
    | 'CustomerPoints'
    | 'ProfileDetails'
    | 'OrdersList';
}

export const data: ITab[] = [
  {
    id: 1,
    title: 'profile.notifications',
    icon: <ProfileIconTab />,
  },
  {
    id: 2,
    title: 'profile.favorite',
    icon: <ProfileIconTab />,
    goTo: 'WishList',
  },
  {
    id: 3,
    title: 'profile.about-app',
    icon: <ProfileIconTab />,
  },
  {
    id: 4,
    title: 'profile.currency',
    icon: <ProfileIconTab />,
    RightIcon: () => <DropDown varient="currencies" />,
  },
  {
    id: 5,
    title: 'profile.language',
    icon: <ProfileIconTab />,
    RightIcon: () => <SwitchLang />,
  },
  {
    id: 6,
    title: 'profile.need-help',
    icon: <ProfileIconTab />,
    bottomSection: <WantTalkSection />,
  },
];
