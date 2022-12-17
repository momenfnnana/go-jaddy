import {useNavigation} from '@react-navigation/native';
import {FreeWishlistIcon} from 'assets/images';
import {Button, Text} from 'components';
import {WishlistScreenNavigationProp} from 'navigators/NavigationsTypes';
import React from 'react';
import {Image, StyleSheet, useWindowDimensions, View} from 'react-native';
import {spacing} from 'theme';

const FreeWishlist = () => {
  const {width} = useWindowDimensions();
  const {navigate} = useNavigation<WishlistScreenNavigationProp>();
  return (
    <View style={styles.container}>
      <Image source={FreeWishlistIcon} style={styles.image} />
      <Text
        tx="wishlist.free-wishlist"
        variant="largeBold"
        center
        top={'xLarge'}
        bottom={'medium'}
      />
      <Text
        tx="wishlist.free-wishlist-description"
        variant="smallLight"
        center
        style={{width: width * 0.7}}
      />
      <Button
        title="wishlist.discover-products"
        style={[styles.discoverProductsBtn, {width: width * 0.6}]}
        onPress={() => navigate('HomeStack', {} as any)}
      />
    </View>
  );
};

export default FreeWishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 190,
    height: 159,
  },
  discoverProductsBtn: {
    alignSelf: 'center',
    marginTop: spacing.xxxLarge + 3,
  },
});
