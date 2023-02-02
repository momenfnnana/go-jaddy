import {createContext, useState} from 'react';
import {ImageData} from 'types';
interface IUserData {
  Avatar?: ImageData;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string | number;
  UserType: string;
  IsGuestUser?: boolean;
  UserTypeDisplay?: string;
}
interface IUserContext {
  userData: IUserData;
  settings: any;
  setUserData: (value: any) => void;
  setSettings: (value: any) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
  currencies: any[];
  setCurrencies: (value: any) => void;
  updateProducts: boolean;
  setUpdateProducts: (value: any) => void;
  refreshCurrency: boolean;
  setRefreshCurrency: (value: any) => void;
}
interface IUserProvider {
  children: JSX.Element;
}
const UserContext = createContext<IUserContext>({
  userData: {
    Avatar: {
      Id: 0,
      ThumbUrl: '',
      Title: '',
      Url: '',
    },
    IsGuestUser: true,
    Email: '',
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    UserType: '',
  },
  settings: {},
  setUserData: ({}) => {},
  setSettings: ({}) => {},
  accessToken: '',
  setAccessToken: ({}) => {},
  currencies: [],
  setCurrencies: ({}) => {},
  updateProducts: false,
  setUpdateProducts: ({}) => {},
  refreshCurrency: false,
  setRefreshCurrency: ({}) => {},
});

const UserProvider = ({children}: IUserProvider) => {
  const [userData, setUserData] = useState<IUserData>({});
  const [settings, setSettings] = useState<any>({});
  const [accessToken, setAccessToken] = useState<string>('');
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [updateProducts, setUpdateProducts] = useState<boolean>(false);
  const [refreshCurrency, setRefreshCurrency] = useState<boolean>(false);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        setSettings,
        settings,
        accessToken,
        setAccessToken,
        currencies,
        setCurrencies,
        updateProducts,
        setUpdateProducts,
        refreshCurrency,
        setRefreshCurrency,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};
