import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

export const useCurrency = () => {
  const [currency, setCurrency] = useState({});
  useEffect(() => {
    const currencyObj = AsyncStorage.getItem('currency');
    currencyObj.then((res: string | null) => {
      if (res) {
        setCurrency(JSON.parse(res));
      }
    });
  }, []);

  return {currency};
};
