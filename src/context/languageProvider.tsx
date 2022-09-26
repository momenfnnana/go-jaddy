import {createContext, ReactNode, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Header {
  languageId: string;
}
interface IHeaderProvider {
  children: ReactNode;
}
const AuthContext = createContext<Header>({
  languageId: '',
});

const AuthProvider = ({children}: IHeaderProvider) => {
  const [languageId, setLanguageId] = useState<string>('');
  useEffect(() => {
    const language = AsyncStorage.getItem('language');
    language.then((res: string | null) => {
      if (res) {
        setLanguageId(res);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{languageId}}>{children}</AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
