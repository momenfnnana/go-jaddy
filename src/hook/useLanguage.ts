import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

export const useLanguage = () => {
  const [language, setLanguage] = useState<string>();
  useEffect(() => {
    const languageId = AsyncStorage.getItem('languageId');
    languageId.then((res: string | null) => {
      if (res) {
        setLanguage(res);
      }
    });
  }, []);

  return {language};
};
