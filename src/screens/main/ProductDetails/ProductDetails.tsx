import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, FlatList} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import {Loader, Text} from 'components';
import {HomeRoutes} from 'navigators/RoutesTypes';
import NetworkErrorScreen from 'screens/NetworkErrorScreen';
import {getProductDetails} from 'services/Home';
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

let PageSize: number = 10;

const ProductDetails = ({}: IProductDetails) => {
  const {params} = useRoute<IProductNavigation>();
  const {Id} = params;
  const [selectedFilter, setSelectedFilter] = useState<any>();
  const [Page, setPage] = useState<number>(1);
  const [reviews, setReviews] = useState<any[]>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const {
    isLoading,
    data: productData,
    isError,
    refetch,
    isRefetching,
  } = useQuery(['getProductDetails'], () => getProductDetails(Id));

  useEffect(() => {
    const data = {
      Page,
      PageSize,
      ProductId: Id,
      Ratings: [],
      WithImageOnly: selectedFilter === 'with-images',
    };
    (async () => {
      await axios
        .post(`${BASE_URL}/api/custom/products/ProductReviews`, data)
        .then(res => {
          setReviews(res.data);
          if (Page < res?.ProductReviews?.TotalPages) {
            setHasNextPage(false);
          }
        })
        .catch(error => {
          console.log({error});
        });
    })();
  }, [Page]);

  if (isLoading || isRefetching) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  if (isError) {
    return <NetworkErrorScreen onPress={refetch} />;
  }

  const Product = productData?.data?.Product;
  const RelatedProductsModel = Product?.RelatedProductsModel;
  const AlsoPurchasedModel = Product?.AlsoPurchasedModel;

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
    <FlatList
      ListHeaderComponent={
        <ListHeaderComponent
          Product={Product}
          Id={Id}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      }
      data={reviews?.ProductReviews?.Items}
      keyExtractor={(_, index) => index.toString}
      renderItem={renderReviews}
      ListFooterComponent={
        <ListFooterComponent
          AlsoPurchasedModel={AlsoPurchasedModel}
          RelatedProductsModel={RelatedProductsModel}
        />
      }
    />
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
