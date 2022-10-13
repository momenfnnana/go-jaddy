import {useQuery} from '@tanstack/react-query';
import {createContext, useState} from 'react';
import {getSetting} from 'services/Auth';

const UserContext = createContext({
  userData: {
    Avatar: {
      Id: '',
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
});

const UserProvider = ({children}) => {
  const [userData, setUserData] = useState({});
  const [settings, setSettings] = useState({});
  const [accessToken, setAccessToken] = useState('');

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        setSettings,
        settings,
        accessToken,
        setAccessToken,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};
