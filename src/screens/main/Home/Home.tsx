import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {HomeRoutes} from 'navigators/RoutesTypes';
import {Text} from 'components';

interface IHomeNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'Home'> {}
interface IHome extends NativeStackScreenProps<HomeRoutes, 'Home'> {}

const Home = (props: IHome) => {
  const navigation = useNavigation<IHomeNavigation>();
  const {t} = useTranslation();
  return (
    <View>
      <Text tx="what_to_add" />
    </View>
  );
};

export default Home;
