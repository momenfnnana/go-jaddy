import {CommonActions, useNavigation} from '@react-navigation/native';
import {readAccessToken} from 'constants';
import {useEffect, useState} from 'react';
import {useLogged} from './useLogged';

interface IProtectedFunction {
  func: () => void;
}

export const useProtectedFunction = () => {
  const {isLogged} = useLogged(true);
  const {dispatch} = useNavigation();
  const protectedFunction = ({func}: IProtectedFunction) => {
    if (isLogged) {
      func();
    } else {
      dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'AuthFlow', params: {screen: 'Login'}}],
        }),
      );
    }
  };
  return {protectedFunction};
};
