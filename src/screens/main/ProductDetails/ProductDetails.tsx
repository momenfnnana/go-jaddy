import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ImageBackground,
  ImageBackgroundProps,
  FlatList,
} from 'react-native';
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
import {DiscountIcon} from 'assets/icons';

interface IProfileNavigation
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

let IMAGE_CONTAINER = 57;

const ProductDetails = ({}: IProductDetails) => {
  const {params} = useRoute<IProfileNavigation>();
  const {Id} = params;
  const {width, height} = useWindowDimensions();
  const {
    isLoading,
    data: productData,
    isError,
    refetch,
  } = useQuery(['getProductDetails'], () => getProductDetails(Id));
  const [product, setProduct] = useState<IProductImages>();

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

  const mainImage: ImageBackgroundProps = {
    height: height * 0.53,
    // flexDirection:'flex-end'
  };
  return (
    <View>
      <ImageBackground
        source={{uri: `${BASE_URL}${GalleryStartIndex?.url}`}}
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
        <View style={styles.row}>
          <Text
            text={Name}
            color={colors.tabsColor}
            variant="largeBold"
            numberOfLines={1}
          />
          <Image
            source={{uri: `${BASE_URL}${Brands[0]?.Image?.File?.url}`}}
            style={styles.brandImage}
          />
        </View>
        <View style={styles.row}>
          {!ShowSku && (
            <Text color={colors.black} variant="mediumLight">
              {Sku}
            </Text>
          )}
        </View>
        <View style={styles.row}>
          <Text
            text={ShortDescription}
            color={colors.tabsColor}
            variant="mediumRegular"
            style={{width: width * 0.7}}
          />
          <View>
            <Text
              text={Price}
              color={colors.tabsColor}
              variant="mediumRegular"
              numberOfLines={1}
            />
            <Text
              text={OldPrice}
              color={colors.grayMain}
              variant="mediumRegular"
              style={styles.oldPrice}
              numberOfLines={1}
            />
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
    </View>
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
  brandImage: {
    width: 100,
    height: 41,
    resizeMode: 'contain',
    marginTop: spacing.normal,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  contentContainer: {
    paddingHorizontal: spacing.normal,
  },
});
