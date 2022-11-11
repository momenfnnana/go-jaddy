import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
type languageTypes = '1' | '2';
export const useLanguage = (refresh?: boolean) => {
  const [language, setLanguage] = useState<languageTypes>('1');
  useEffect(() => {
    const languageId = AsyncStorage.getItem('languageId');
    languageId.then((res: string | null) => {
      if (res) {
        setLanguage(res);
      }
    });
  }, [refresh]);

  return {language};
};
