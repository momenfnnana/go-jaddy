import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {HomeRoutes} from 'navigators/RoutesTypes';
import React from 'react';
import {View, Text} from 'react-native';

interface IHomeNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'Home'> {}
interface IHome extends NativeStackScreenProps<HomeRoutes, 'Home'> {}

const Home = (props: IHome) => {
  const navigation = useNavigation<IHomeNavigation>();
  return (
    <View>
      <Text onPress={() => navigation.navigate('Profile', {userId: '1'})}>
        Home
      </Text>
    </View>
  );
};

export default Home;
