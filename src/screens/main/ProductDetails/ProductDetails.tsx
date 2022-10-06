import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ImageBackground,
  ImageBackgroundProps,
  FlatList,
  ScrollView,
  ViewStyle,
  Pressable,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
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
import {DiscountIcon} from 'assets/icons';
import {useCurrency} from 'hook/useCurrency';

interface IProductNavigation
  extends NativeStackNavigationProp<HomeRoutes, 'ProductDetails'>,
    RouteProp<HomeRoutes, 'ProductDetails'> {}

interface IProductDetails
  extends NativeStackScreenProps<HomeRoutes, 'ProductDetails'> {}
import {HomeNavigationsType} from 'navigators/NavigationsTypes';

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

let IMAGE_CONTAINER = 57;

const ProductDetails = ({}: IProductDetails) => {
  const {params} = useRoute<IProductNavigation>();
  const {navigate} = useNavigation<IProductNavigation>();
  const {Id} = params;
  const {width, height} = useWindowDimensions();
  const {
    isLoading,
    data: productData,
    isError,
    refetch,
  } = useQuery(['getProductDetails'], () => getProductDetails(Id));
  const {currency} = useCurrency();

  if (isLoading) {
    return <Loader containerStyle={styles.loaderStyle} />;
  }

  if (isError) {
    return <NetworkErrorScreen onPress={refetch} />;
  }
  const imagesList: IProductImages[] =
    productData.data?.Product?.MediaGalleryModel?.Files;
  const ShowDiscountBadge: boolean =
    productData.data?.Product?.ShowDiscountBadge;
  const ProductPrice = productData.data?.Product?.ProductPrice;
  const SavingPercent: number = ProductPrice?.SavingPercent;
  const Price: string = ProductPrice?.Price;
  const OldPrice: string = ProductPrice?.OldPrice;
  const ShortDescription: string = productData.data?.Product?.ShortDescription;
  const Name: string = productData.data?.Product?.Name;
  const Brands: any[] = productData.data?.Product?.Brands;
  const ShowSku: boolean = productData.data?.Product?.ShowSku;
  const Sku: string = productData.data?.Product?.Sku;

  const GalleryStartIndex: number =
    productData.data?.Product?.MediaGalleryModel?.Files[
      productData.data?.Product?.MediaGalleryModel?.GalleryStartIndex
    ];
  const Product = productData.data?.Product;
  console.log({OldPrice: Product?.StoreImage?.Url});

  const mainImage: ImageBackgroundProps = {
    flex: 0.5,
  } as ViewStyle;

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <ImageBackground
        source={{uri: `${BASE_URL}${Product?.Images[0]?.Url}`}}
        style={mainImage}>
        <FlatList
          data={imagesList}
          keyExtractor={(_, index) => index.toString()}
          style={styles.flatList}
          renderItem={({item}) => {
            return (
              <View style={styles.imagesRowContainer}>
                <Image
                  source={{uri: `${BASE_URL}${item.url}`}}
                  style={styles.imagesRow}
                />
              </View>
            );
          }}
        />
        {ShowDiscountBadge && (
          <View style={styles.discountPercentageContainer}>
            <DiscountIcon />
            <Text
              style={styles.discountPercentage}
              color={colors.white}
              text={`${SavingPercent}%`}
            />
          </View>
        )}
      </ImageBackground>
      <View style={styles.contentContainer}>
        <View style={[styles.row, styles.justifyBetween]}>
          <Text
            text={Product?.Name}
            color={colors.tabsColor}
            variant="largeBold"
            numberOfLines={1}
          />
          {Product?.StoreId !== 0 && (
            <Pressable
            // onPress={()=>navigate('')}
            >
              <Image
                source={{uri: `${BASE_URL}${Product?.StoreImage?.Url}`}}
                style={[styles.storeImage, styles.storeWidth]}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.row}>
          {Product?.ShowSku && (
            <Text color={colors.black} variant="mediumLight">
              {Product?.Sku}
            </Text>
          )}
        </View>
        <View style={[styles.row, styles.justifyBetween]}>
          <Text
            text={Product?.ShortDescription}
            color={colors.tabsColor}
            variant="mediumRegular"
          />
          <View style={[styles.priceContainer, styles.storeWidth]}>
            <Text
              text={Product?.ProductPrice?.Price}
              color={colors.orange}
              variant="xLargeBold"
              numberOfLines={1}
            />
            <View style={styles.row}>
              <Text
                text={Product?.ProductPrice?.OldPrice?.toString()}
                color={colors.grayMain}
                variant="mediumRegular"
                style={styles.oldPrice}
                numberOfLines={1}
              />
              <Text text={currency?.Symbol} />
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Text
            tx="product-details.select-color"
            color={colors.tabsColor}
            variant="mediumBold"
          />
        </View>
      </View>
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
  flatList: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'red',
    marginLeft: 72,
  },
  imagesRowContainer: {
    width: IMAGE_CONTAINER,
    height: IMAGE_CONTAINER,
    borderWidth: 2,
    borderColor: colors.orange,
    padding: 1,
  },
  imagesRow: {
    width: '100%',
    height: '100%',
  },
  discountPercentageContainer: {
    backgroundColor: colors.orangeDark,
    width: 38,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.tiny + 1,
    position: 'absolute',
    bottom: -spacing.medium,
    left: spacing.normal - 1,
  },
  discountPercentage: {},
  storeImage: {
    height: 41,
    resizeMode: 'contain',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginHorizontal: spacing.tiny,
  },
  contentContainer: {
    flex: 0.5,
    paddingHorizontal: spacing.normal,
    marginTop: spacing.normal,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  storeWidth: {
    width: 50,
  },
});
