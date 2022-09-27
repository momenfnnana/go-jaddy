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

interface IProfileNavigation
  extends NativeStackNavigationProp<BottomTabsRoutes, 'Profile'>,
    RouteProp<BottomTabsRoutes, 'Profile'> {}

interface IProfile
  extends NativeStackScreenProps<BottomTabsRoutes, 'Profile'> {}
const Profile = (props: IProfile) => {
  const {navigate} = useNavigation<IProfileNavigation>();
  const {params} = useRoute<IProfileNavigation>();
  const {userId} = params;
  const {setUserData} = useContext(UserContext);
  const logoutHandler = () => {
    AsyncStorage.clear();
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
