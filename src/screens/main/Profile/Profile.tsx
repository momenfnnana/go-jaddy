import React from 'react';
import {View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {BottomTabsRoutes} from 'navigators/RoutesTypes';
import type {RouteProp} from '@react-navigation/native';
import {Text} from 'components';

interface IProfileNavigation
  extends NativeStackNavigationProp<BottomTabsRoutes, 'Profile'>,
    RouteProp<BottomTabsRoutes, 'Profile'> {}

interface IProfile extends NativeStackScreenProps<BottomTabsRoutes, 'Profile'> {}
const Profile = (props: IProfile) => {
  const {navigate} = useNavigation<IProfileNavigation>();
  const {params} = useRoute<IProfileNavigation>();
  const {userId} = params;

  return (
    <View>
      <Text text="Profile" />
    </View>
  );
};

export default Profile;
