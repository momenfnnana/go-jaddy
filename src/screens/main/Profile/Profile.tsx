import React, {useContext} from 'react';
import {Pressable, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {BottomTabsRoutes} from 'navigators/RoutesTypes';
import type {RouteProp} from '@react-navigation/native';
import {Text} from 'components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from 'context/UserContext';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import axios from 'axios';

const Profile = (props: HomeNavigationsType) => {
  const {navigate} = useNavigation<HomeNavigationsType>();
  const {params} = useRoute<HomeNavigationsType>();
  const {userId} = params;
  const {setUserData} = useContext(UserContext);
  const logoutHandler = async () => {
    axios.defaults.headers.common['AccessToken'] = '';
    await AsyncStorage.removeItem('accessToken');
    setUserData({});
  };
  return (
    <View>
      <Pressable onPress={logoutHandler}>
        <Text text="Logout" />
      </Pressable>
    </View>
  );
};

export default Profile;
