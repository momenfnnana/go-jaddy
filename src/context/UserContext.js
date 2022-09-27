import {createContext, useState} from 'react';

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
  setUserData: ({}) => {},
});

const UserProvider = ({children}) => {
  const [userData, setUserData] = useState({});

  return (
    <UserContext.Provider value={{userData, setUserData}}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};
