import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

export const useLanguage = (refresh?: boolean) => {
  const [language, setLanguage] = useState<string>();
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
