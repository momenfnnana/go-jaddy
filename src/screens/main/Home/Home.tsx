import React, {ReactNode} from 'react';
import {StyleSheet, View, Platform, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {BottomTabsRoutes} from 'navigators/RoutesTypes';
import {
  MainHeader,
  Text,
  SearchInput,
  ScreenContainer,
  Loader,
} from 'components';
import {colors, spacing} from 'theme';
import {Carasoule, ShowSection} from './components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AdidasIcon, BannerImage} from 'assets/icons';
import CategoriesCarasoule from './components/CategoriesCarasoule';
import {ICategories, IProductInterface} from './types';
import {ProductImage} from 'assets/icons';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {getStores} from 'services/Home';
import {NetworkErrorScreen} from 'screens';

interface IHomeNavigation
  extends NativeStackNavigationProp<BottomTabsRoutes, 'Home'> {}
interface IHome extends NativeStackScreenProps<BottomTabsRoutes, 'Home'> {}

const categories: ICategories[] = [
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
  {
    imageUrl: AdidasIcon,
    name: 'Adidas',
  },
];

const data: IProductInterface[] = [
  {
    id: 1,
    isFav: true,
    title: 'Monki Utility ميدي فستان القميص باللون الكحلي',
    acttualPrice: '59',
    prevPrice: '80',
    currency: 'ILS',
    rate: 4.5,
    productColors: [colors.red, colors.blue, colors.red, colors.blue],
    isNews: false,
    isHaveDiscount: false,
    discountValue: '20%',
    imageUrl: ProductImage,
  },
  {
    id: 1,
    isFav: false,
    title: 'Monki Utility ميدي فستان القميص باللون الكحلي',
    acttualPrice: '59',
    prevPrice: '80',
    currency: 'ILS',
    rate: 4.5,
    productColors: [colors.red, colors.blue, colors.red, colors.blue],
    isNews: true,
    isHaveDiscount: true,
    discountValue: '20%',
    imageUrl: ProductImage,
  },
  {
    id: 1,
    isFav: false,
    title: 'Monki Utility ميدي فستان القميص باللون الكحلي',
    acttualPrice: '59',
    prevPrice: '80',
    currency: 'ILS',
    rate: 4.5,
    productColors: [colors.red, colors.blue, colors.red, colors.blue],
    isNews: true,
    isHaveDiscount: true,
    discountValue: '20%',
    imageUrl: ProductImage,
  },
  {
    id: 1,
    isFav: false,
    title: 'Monki Utility ميدي فستان القميص باللون الكحلي',
    acttualPrice: '59',
    prevPrice: '80',
    currency: 'ILS',
    rate: 4.5,
    productColors: [colors.red, colors.blue, colors.red, colors.blue],
    isNews: true,
    isHaveDiscount: true,
    discountValue: '20%',
    imageUrl: ProductImage,
  },
];

const Home = (props: IHome) => {
  const navigation = useNavigation<IHomeNavigation>();
  const {t} = useTranslation();
  const {top} = useSafeAreaInsets();

  const {
    isLoading,
    data: storesData,
    isError,
    refetch,
  } = useQuery(['getStores'], getStores);

  if (isLoading) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  if (isError) {
    return <NetworkErrorScreen onPress={refetch} />;
  }

  return (
    <View style={{flex: 1}}>
      <MainHeader />
      <SearchInput containerStyle={styles.searchInputContainer} />
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{paddingHorizontal: 15}}>
          <Carasoule
            containerStyle={{
              marginTop:
                -top +
                (Platform.OS === 'android'
                  ? spacing.medium * 5
                  : spacing.medium * 2),
            }}
          />
          <CategoriesCarasoule items={storesData.data?.Stores} />
          <ShowSection
            title="home.arrival"
            coloredTitle="home.news"
            data={data}
          />
          <Image source={BannerImage} style={styles.bannerImage} />
          <ShowSection
            title="home.best"
            coloredTitle="home.selling"
            data={data}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  searchInputContainer: {
    // position: 'absolute',
    // width: '100%',
    // alignSelf: 'center',
    // top: -spacing.xxxLarge,
    marginHorizontal: spacing.normal - 1,
    marginTop: -20,
    marginBottom: 20,
  },
  bannerImage: {
    // flex: 1,
    resizeMode: 'cover',
    maxHeight: 100,
    marginHorizontal: -(spacing.normal - 1),
  },
  paddingSection: {
    paddingHorizontal: spacing.normal - 1,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
