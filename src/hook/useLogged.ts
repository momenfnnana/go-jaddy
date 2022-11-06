import {readAccessToken} from 'constants';
import {useEffect, useState} from 'react';

export const useLogged = (refresh?: boolean) => {
  const [isLogged, setLogged] = useState<boolean>();
  useEffect(() => {
    readAccessToken().then(res => {
      if (res) {
        setLogged(true);
      } else {
        setLogged(false);
      }
    });
  }, [refresh]);

  return {isLogged};
};
