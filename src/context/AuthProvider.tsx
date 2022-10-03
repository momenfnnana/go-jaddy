import {createContext, ReactNode, useEffect, useState} from 'react';
import {useLanguage} from 'hook/useLanguage';

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
  const {language} = useLanguage();
  useEffect(() => {
    if (language) {
      setLanguageId(language);
    }
  }, [language]);

  return (
    <AuthContext.Provider value={{languageId}}>{children}</AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
