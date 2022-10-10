import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {Loader, Text} from 'components';
import {HomeRoutes} from 'navigators/RoutesTypes';
import NetworkErrorScreen from 'screens/NetworkErrorScreen';
import {getProductDetails, getReviews} from 'services/Home';
import {BASE_URL} from 'utils/Axios';
import {colors, spacing} from 'theme';
import {useCurrency} from 'hook/useCurrency';
import {ListFooterComponent, ListHeaderComponent} from './components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ShowSection} from '../Home/components';
import axios from 'axios';
import moment from 'moment';

interface IProductNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'ProductDetails'>,
    RouteProp<HomeRoutes, 'ProductDetails'> {}

interface IProductDetails
  extends NativeStackScreenProps<HomeRoutes, 'ProductDetails'> {}

interface IProductImages {
  id: number;
  folderId: number;
  mime: string;
  type: string;
  createdOn: Date;
  alt: string;
  titleAttr: string;
  path: string;
  url: string;
  thumbUrl: string;
  lastUpdated: string;
  size: number;
  name: string;
  dir: string;
  title: string;
  ext: string;
  dimensions: string;
}

const ProductDetails = ({}: IProductDetails) => {
  const {params} = useRoute<IProductNavigation>();
  const {Id} = params;
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [ratingFilters, setRatingFilters] = useState<string[]>([]);
  const {
    isLoading,
    data: productData,
    isError,
    refetch,
    isRefetching,
  } = useQuery(['getProductDetails'], () => getProductDetails(Id));

  const {
    data,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    hasNextPage: hasNextPageReviews,
    fetchNextPage,
    refetch: refetchReviews,
    isFetchingNextPage,
    isRefetching: isRefetchingReviews,
  } = useInfiniteQuery(
    ['perantCategories'],
    ({pageParam}) =>
      getReviews({
        pageParam,
        PageSize: 5,
        ProductId: Id,
        WithImageOnly: selectedFilter.includes('with-images'),
        Ratings: ratingFilters,
      }),
    {
      getNextPageParam: lastPage => {
        if (
          lastPage?.data?.ProductReviews?.Page <
          lastPage?.data?.ProductReviews?.TotalPages
        ) {
          return lastPage?.data?.ProductReviews?.Page + 1;
        }
        return null;
      },
    },
  );

  useEffect(() => {
    refetchReviews();
  }, [selectedFilter.length, ratingFilters.length]);
  useEffect(() => {
    refetch();
  }, [Id]);

  if (isLoading || isRefetching) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  if (isError) {
    return <NetworkErrorScreen onPress={refetch} />;
  }

  const Product = productData?.data?.Product;
  const RelatedProductsModel = Product?.RelatedProductsModel;
  const AlsoPurchasedModel = Product?.AlsoPurchasedModel;

  const loadMore = () => {
    if (hasNextPageReviews) {
      fetchNextPage();
    }
  };

  const renderReviews = ({item}) => {
    return (
      <View style={[styles.reviewItem, styles.contentContainer]}>
        <View style={[styles.row, {alignItems: 'flex-start'}]}>
          <Image
            source={{uri: `${BASE_URL}${item?.CustomerAvatar?.Url}`}}
            style={styles.customerReviewAvatar}
          />
          <View>
            <View style={styles.row}>
              <Text
                tx={item?.CustomerName}
                style={styles.customerName}
                variant="smallLight"
                color={colors.arrowBackgroundColor2}
              />
              {[0, 1, 2, 3, 4].map((_, index) => {
                return (
                  <AntDesign
                    name="star"
                    color={
                      index < item?.Rating ? colors.orange : colors.reloadColor
                    }
                    key={index}
                  />
                );
              })}
            </View>
            <View style={styles.rateContent}>
              <Text
                tx={item?.ReviewText}
                variant="smallRegular"
                color={colors.tabsColor}
              />
              {item?.ReviewImage?.Url?.length && (
                <Image
                  source={{uri: `${BASE_URL}${item?.ReviewImage?.Url}`}}
                  style={styles.reviewImage}
                />
              )}
              <Text
                tx={item?.WrittenOnStr}
                variant="xSmallLight"
                color={colors.arrowColor}
                style={styles.reviewDate}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList
        ListHeaderComponent={
          <ListHeaderComponent
            Product={Product}
            ProductId={Id}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setRatingFilters={setRatingFilters}
            ratingFilters={ratingFilters}
            isRefetchingReviews={isLoadingReviews || isRefetchingReviews}
          />
        }
        data={data?.pages.map(page => page.data.ProductReviews?.Items).flat()}
        keyExtractor={(_, index) => index.toString}
        renderItem={renderReviews}
        onEndReached={loadMore}
        ListFooterComponent={
          <>
            {isFetchingNextPage ||
              (isLoadingReviews && (
                <Loader size={'small'} color={colors.primary} />
              ))}
            <ListFooterComponent
              AlsoPurchasedModel={AlsoPurchasedModel}
              RelatedProductsModel={RelatedProductsModel}
              ProductId={Id}
              productData={productData}
            />
          </>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.normal,
    marginTop: spacing.normal,
  },
  reviewItem: {
    marginTop: spacing.medium,
  },
  customerReviewAvatar: {
    height: 51,
    width: 51,
    borderRadius: 51 * 0.5,
    marginRight: spacing.smaller,
  },
  customerName: {
    marginHorizontal: spacing.smaller,
  },
  rateContent: {
    marginHorizontal: spacing.smaller,
  },
  reviewDate: {
    marginTop: spacing.tiny,
  },
  reviewImage: {
    height: 77,
    width: 75,
    marginVertical: spacing.medium,
  },
});
