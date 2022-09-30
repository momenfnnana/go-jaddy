import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {BottomTabsRoutes} from 'navigators/RoutesTypes';
import {MainHeader, SearchInput, Loader} from 'components';
import {spacing} from 'theme';
import {Carasoule, ShowSection} from './components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CategoriesCarasoule from './components/CategoriesCarasoule';
import {useQuery} from '@tanstack/react-query';
import {
  getStores,
  getSlider,
  getRecentAdded,
  getAdvertisements,
  getBestSellers,
} from 'services/Home';
import {NetworkErrorScreen} from 'screens';
import {BASE_URL} from 'utils/Axios';

interface IHomeNavigation
  extends NativeStackNavigationProp<BottomTabsRoutes, 'Home'> {}
interface IHome extends NativeStackScreenProps<BottomTabsRoutes, 'Home'> {}

const Home = (props: IHome) => {
  const navigation = useNavigation<IHomeNavigation>();
  const {t} = useTranslation();
  const {top} = useSafeAreaInsets();

  const {
    isLoading: isLoadingStores,
    data: storesData,
    isError: isErrorStore,
    refetch: refetchStore,
    isRefetching: isRefetchingrefetchStore,
  } = useQuery(['getStores'], getStores, {
    enabled: false,
  });
  const {
    isLoading: isLoadingSlider,
    data: sliderData,
    isError: isErrorSlider,
    refetch: refetchSlider,
    isRefetching: isRefetchingrefetchSlider,
  } = useQuery(['getSlider'], getSlider, {
    enabled: false,
  });
  const {
    isLoading: isLoadingRecentAdded,
    data: recentAdded,
    isError: isErrorRecentAdded,
    refetch: refetchRecentAdded,
    isRefetching: isRefetchingrefetchRecentAdded,
  } = useQuery(['getRecentAdded'], getRecentAdded, {
    enabled: false,
  });
  const {
    isLoading: isLoadingAdvertisements,
    data: advertisements,
    isError: isErrorAdvertisements,
    refetch: refetchAdvertisements,
    isRefetching: isRefetchingrefetchAdvertisements,
  } = useQuery(['getAdvertisements'], getAdvertisements, {
    enabled: false,
  });
  const {
    isLoading: isLoadinggetBestSellers,
    data: bestSellers,
    isError: isErrorgetBestSellers,
    refetch: refetchgetBestSellers,
    isRefetching: isRefetchinggetBestSellers,
  } = useQuery(['getBestSellers'], getBestSellers, {
    enabled: false,
  });

  const getAllData = () => {
    refetchSlider();
    refetchStore();
    refetchRecentAdded();
    refetchAdvertisements();
    refetchgetBestSellers();
  };

  const onRefresh = React.useCallback(() => {
    getAllData();
  }, []);

  useEffect(() => {
    getAllData();
  }, []);

  if (
    isLoadingStores ||
    isLoadingSlider ||
    isLoadingRecentAdded ||
    isLoadingAdvertisements ||
    isLoadinggetBestSellers
  ) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  if (isErrorStore) {
    return <NetworkErrorScreen onPress={refetchStore} />;
  }

  return (
    <View style={{flex: 1}}>
      <MainHeader />
      <SearchInput containerStyle={styles.searchInputContainer} />
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainerStyle}
          refreshControl={
            <RefreshControl
              refreshing={
                isRefetchingrefetchStore ||
                isRefetchingrefetchSlider ||
                isRefetchingrefetchRecentAdded ||
                isRefetchingrefetchAdvertisements ||
                isRefetchinggetBestSellers
              }
              onRefresh={onRefresh}
            />
          }>
          <Carasoule
            data={sliderData?.data?.Sliders}
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
            data={recentAdded?.data?.ProductSummary?.Items}
            showSeeMore={false}
          />
          {advertisements?.data?.Advertisements?.map(({MobileImage}, index) => (
            <Image
              key={index}
              source={{uri: `${BASE_URL}${MobileImage?.Url}`}}
              style={styles.bannerImage}
            />
          ))}
          <ShowSection
            title="home.best"
            coloredTitle="home.selling"
            data={bestSellers?.data?.ProductSummary?.Items}
            showSeeMore={false}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  searchInputContainer: {
    marginHorizontal: spacing.normal - 1,
    marginTop: -spacing.large,
    marginBottom: spacing.large,
  },
  bannerImage: {
    height: 100,
    resizeMode: 'cover',
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
  scrollViewContainerStyle: {
    paddingHorizontal: spacing.normal - 1,
    paddingVertical: spacing.normal - 1,
  },
});
