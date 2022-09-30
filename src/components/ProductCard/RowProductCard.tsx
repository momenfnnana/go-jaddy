import Text from 'components/Text';
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {IProductInterface} from 'screens/main/Home/types';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';

const RowProductCard = (props: IProductInterface) => {
  const {
    // title,
    Image: ImageResponse,
    Price,
    Badges,
    AddedToCart,
    Name,
    RatingSum,
    // isHaveDiscount,
    // discountValue,
    // acttualPrice,
    // prevPrice,
    // currency,
    // rate,
    // productColors,
    // isNews,
    // isFav,
  } = props;
  console.log({props});

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: `${BASE_URL}${ImageResponse?.Url}`}}
          style={styles.image}
        />
      </View>
      <View style={styles.productNameContainer}>
        <Text
          text={Name}
          variant="mediumRegular"
          color={colors.tabsColor}
          numberOfLines={2}
          style={{width: '80%'}}
        />
      </View>
      <View style={styles.priceContainer}>
        <Text>asd</Text>
      </View>
    </View>
  );
};

export default RowProductCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    borderRadius: spacing.medium - 2,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  imageContainer: {
    flex: 0.25,
  },
  productNameContainer: {
    flex: 0.5,
  },
  priceContainer: {
    flex: 0.25,
    backgroundColor: 'red',
  },
});
