import {createContext, useState} from 'react';
import {ImageData} from 'types';
interface IUserData {
  Avatar?: ImageData;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string | number;
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
    Email: '',
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
  },
  settings: {},
  setUserData: ({}) => {},
  setSettings: ({}) => {},
  accessToken: '',
  setAccessToken: ({}) => {},
  currencies: [],
  setCurrencies: ({}) => {},
});

const UserProvider = ({children}: IUserProvider) => {
  const [userData, setUserData] = useState<IUserData>({});
  const [settings, setSettings] = useState<any>({});
  const [accessToken, setAccessToken] = useState<string>('');
  const [currencies, setCurrencies] = useState<any[]>([]);

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
      }}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};
