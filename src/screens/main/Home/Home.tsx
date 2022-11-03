import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Image,
  RefreshControl,
  Pressable,
  Linking,
} from 'react-native';
import {MainHeader, SearchInput, Loader, ShowSection} from 'components';
import {spacing} from 'theme';
import {Carasoule} from './components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import StoresCarasoule from './components/StoresCarasoule';
import {useQuery} from '@tanstack/react-query';
import {
  getStores,
  getSlider,
  getRecentAdded,
  getAdvertisements,
  getBestSellers,
} from 'services/Home';
import {BASE_URL} from 'utils/Axios';
import {ImageData} from 'types';
import {UserContext} from 'context/UserContext';
interface IAdvertisements {
  Link: string;
  MobileImage: ImageData;
  Id: number;
}
const Home = () => {
  const {top} = useSafeAreaInsets();
  const {settings} = useContext(UserContext);
  const {CatalogSettings, StoreSettings} = settings;
  const {
    isLoading: isLoadingStores,
    data: storesData,
    refetch: refetchStore,
    isRefetching: isRefetchingrefetchStore,
  } = useQuery(['getStores'], getStores, {
    // enabled: StoreSettings?.ShowStoresOnHomePage === 'True',
    enabled: false,
  });
  const {
    isLoading: isLoadingSlider,
    data: sliderData,
    refetch: refetchSlider,
    isRefetching: isRefetchingrefetchSlider,
  } = useQuery(['getSlider'], getSlider, {
    enabled: false,
  });
  const {
    isLoading: isLoadingRecentAdded,
    data: recentAdded,
    refetch: refetchRecentAdded,
    isRefetching: isRefetchingrefetchRecentAdded,
  } = useQuery(['getRecentAdded'], getRecentAdded, {
    enabled: false,
  });
  const {
    isLoading: isLoadingAdvertisements,
    data: advertisements,
    refetch: refetchAdvertisements,
    isRefetching: isRefetchingrefetchAdvertisements,
  } = useQuery(['getAdvertisements'], getAdvertisements, {
    enabled: false,
  });
  const {
    isLoading: isLoadinggetBestSellers,
    data: bestSellers,
    refetch: refetchgetBestSellers,
    isRefetching: isRefetchinggetBestSellers,
  } = useQuery(['getBestSellers'], getBestSellers, {
    // enabled: CatalogSettings?.ShowBestsellersOnHomepage === 'True',
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
          <StoresCarasoule items={storesData.data?.Stores} />
          <ShowSection
            title="home.arrival"
            coloredTitle="home.news"
            data={recentAdded?.data?.ProductSummary?.Items}
            WishlistEnabled={recentAdded?.data?.ProductSummary?.WishlistEnabled}
            showSeeMore={false}
          />
          {advertisements?.data?.Advertisements?.map(
            ({MobileImage, Link, Id}: IAdvertisements, index: number) => (
              <Pressable onPress={() => Linking.openURL(Link)} key={Id}>
                <Image
                  key={index}
                  source={{uri: `${BASE_URL}${MobileImage?.Url}`}}
                  style={styles.bannerImage}
                />
              </Pressable>
            ),
          )}
          <ShowSection
            title="home.best"
            coloredTitle="home.selling"
            data={bestSellers?.data?.ProductSummary?.Items}
            WishlistEnabled={bestSellers?.data?.ProductSummary?.WishlistEnabled}
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
