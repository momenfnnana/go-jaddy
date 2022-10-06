import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

interface ICurrency {
  Symbol: string;
}

export const useCurrency = () => {
  const [currency, setCurrency] = useState<ICurrency>();
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
