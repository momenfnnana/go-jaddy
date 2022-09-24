import {
  View,
  Text,
  ImageBackground,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import {LogoBG, LogoSplash, SplashBG} from 'assets/images';
import {useNavigation} from '@react-navigation/native';
import {AuthRoutes} from 'navigators/RoutesTypes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface ISplashNavigation extends NativeStackNavigationProp<AuthRoutes> {}

const Splash = () => {
  const {width, height} = useWindowDimensions();
  const {navigate} = useNavigation<ISplashNavigation>();

  useEffect(() => {
    (() => {
      setTimeout(() => {
        navigate('Onboarding');
      }, 3000);
    })();
  }, []);

  return (
    <ImageBackground
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      source={SplashBG}>
      <ImageBackground
        style={{
          width: height / 1.5,
          height: height / 1.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={LogoBG}>
        <Image style={{width: 114, height: 114}} source={LogoSplash} />
      </ImageBackground>
    </ImageBackground>
  );
};

export default Splash;
