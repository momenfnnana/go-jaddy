import {readAccessToken} from 'constants';
import {useEffect, useState} from 'react';

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string>();
  useEffect(() => {
    readAccessToken()
      .then((res: string | null) => {
        if (res) {
          setAccessToken(res);
        }
      })
      .catch(error => {});
  }, []);
  const reload = (token: string) => {
    setAccessToken(token);
  };
  return {accessToken, reload};
};
