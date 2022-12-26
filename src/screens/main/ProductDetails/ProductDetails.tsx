import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {Button, Loader, ReviewList} from 'components';
import {HomeRoutes} from 'navigators/RoutesTypes';
import NetworkErrorScreen from 'screens/NetworkErrorScreen';
import {getProductDetails, getReviews} from 'services/Home';
import {colors, spacing} from 'theme';
import {ListFooterComponent, ListHeaderComponent} from './components';
import {IProductNavigation} from 'navigators/NavigationsTypes';
import {Ifiltter} from '../StoreDetails/StoreDetails';
import EmptyPage from 'components/EmptyPage/EmptyPage';

interface IProductDetails
  extends NativeStackScreenProps<HomeRoutes, 'ProductDetails'> {}
const initialFilterValues = {ratings: [], withImage: false};
const ProductDetails = ({}: IProductDetails) => {
  const {params} = useRoute<IProductNavigation>();
  const {Id} = params;
  const [selectedFilter, setSelectedFilter] = useState<Ifiltter>({
    ratings: [],
    withImage: false,
  });
  const [ratingFilters, setRatingFilters] = useState<string[]>([]);
  const {
    isLoading,
    data: productData,
    isError,
    refetch,
    isRefetching,
  } = useQuery([`getProductDetails${Id}`], () => getProductDetails(Id));

  const {
    data,
    isLoading: isLoadingReviews,
    hasNextPage: hasNextPageReviews,
    fetchNextPage,
    refetch: refetchReviews,
    isFetchingNextPage,
    isRefetching: isRefetchingReviews,
    isFetchedAfterMount,
  } = useInfiniteQuery(
    [`getReviews${Id}`],
    ({pageParam}) =>
      getReviews({
        pageParam,
        PageSize: 5,
        ProductId: Id,
        WithImageOnly: selectedFilter.withImage,
        Ratings: selectedFilter.ratings,
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
  const isHavingFilters = useMemo(() => {
    if (
      !!initialFilterValues.ratings.length ===
        !!selectedFilter.ratings.length &&
      initialFilterValues.withImage === selectedFilter.withImage
    ) {
      return false;
    }
    return true;
  }, [initialFilterValues, selectedFilter]);

  useEffect(() => {
    refetchReviews();
  }, [selectedFilter, ratingFilters.length]);
  useEffect(() => {
    refetch();
  }, [Id]);

  if (isLoading || isRefetching || isLoadingReviews) {
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

  const reviewsList = data?.pages
    .map(page => page.data?.ProductReviews?.Items)
    .flat();

  return (
    <ScrollView keyboardDismissMode="interactive">
      <ListHeaderComponent
        Product={Product}
        ProductId={Id}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setRatingFilters={setRatingFilters}
        ratingFilters={ratingFilters}
        isRefetchingReviews={isLoadingReviews || isRefetchingReviews}
        reviewsList={reviewsList as any[]}
      />
      {!!reviewsList?.length &&
        reviewsList?.map((item, index) => (
          <ReviewList key={index.toString()} item={item} />
        ))}
      {reviewsList?.length === 0 && isHavingFilters && (
        <EmptyPage
          descritopn="product-details.no-rates-added-title"
          title="product-details.no-rates-added-description"
          displayButton={false}
          showImage={false}
        />
      )}
      {hasNextPageReviews && (
        <Button
          disabled={isFetchedAfterMount}
          isLoading={isLoadingReviews}
          title="product-details.load-more"
          variant="Primary"
          textVariant="smallRegular"
          onPress={loadMore}
          style={styles.buttonContainer}
        />
      )}
      {isFetchingNextPage ||
        (isLoadingReviews && <Loader size={'small'} color={colors.primary} />)}
      <ListFooterComponent
        AlsoPurchasedModel={AlsoPurchasedModel}
        RelatedProductsModel={RelatedProductsModel}
        ProductId={Id}
        productData={productData}
        hasNextPageReviews={hasNextPageReviews}
        loadMore={loadMore}
        refetchReviews={refetchReviews}
      />
    </ScrollView>
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
  buttonContainer: {
    justifyContent: 'center',
    marginHorizontal: spacing.huge * 2,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.tiny + 2,
    marginTop: spacing.medium,
  },
});
