import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {ICurrency} from 'types';

export const useCurrency = (refresh?: boolean) => {
  const [currency, setCurrency] = useState<ICurrency>();
  useEffect(() => {
    const currencyObj = AsyncStorage.getItem('currency');
    currencyObj.then((res: string | null) => {
      if (res) {
        setCurrency(JSON.parse(res));
      }
    });
  }, [refresh]);

  return {currency};
};
