import React from 'react';
import {View, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {HomeRoutes} from 'navigators/RoutesTypes';
import type {RouteProp} from '@react-navigation/native';

interface IProfileNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'Profile'>,
    RouteProp<HomeRoutes, 'Profile'> {}

interface IProfile extends NativeStackScreenProps<HomeRoutes, 'Profile'> {}
const Profile = (props: IProfile) => {
  const {navigate} = useNavigation<IProfileNavigation>();
  const {params} = useRoute<IProfileNavigation>();
  const {userId} = params;

  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;
