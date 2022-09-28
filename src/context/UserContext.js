import {useQuery} from '@tanstack/react-query';
import {createContext, useState} from 'react';
import {getSetting} from 'services/Auth';

const UserContext = createContext({
  userData: {
    AccessToken: '',
    RememberMe: false,
    UserEmailAddress: '',
    UserFullName: '',
    UserId: '',
    UserPhoneNumber: '',
    UserType: '',
  },
  settings: {},
  setUserData: ({}) => {},
  setSettings: ({}) => {},
});

const UserProvider = ({children}) => {
  const [userData, setUserData] = useState({});
  const [settings, setSettings] = useState({});

  return (
    <UserContext.Provider
      value={{userData, setUserData, setSettings, settings}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};
