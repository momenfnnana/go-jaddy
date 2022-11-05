import {useNavigation} from '@react-navigation/native';
import {FreeWishlistIcon} from 'assets/images';
import {Button, Text} from 'components';
import {WishlistScreenNavigationProp} from 'navigators/NavigationsTypes';
import React from 'react';
import {Image, StyleSheet, useWindowDimensions, View} from 'react-native';
import {spacing} from 'theme';

interface IEmptyPage {
  title?: string;
  descritopn?: string;
  children?: React.ReactNode;
  displayButton?: boolean;
}

const EmptyPage = ({
  title,
  descritopn,
  displayButton,
  children,
}: IEmptyPage) => {
  const {width} = useWindowDimensions();
  const {navigate} = useNavigation<WishlistScreenNavigationProp>();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={FreeWishlistIcon} style={styles.image} />
      <Text
        tx={title}
        variant="largeBold"
        center
        top={'xLarge'}
        bottom={'medium'}
      />
      <Text
        tx={descritopn}
        variant="smallLight"
        center
        style={{width: width * 0.7}}
      />
      {displayButton && (
        <Button
          title="wishlist.discover-products"
          style={[styles.discoverProductsBtn, {width: width * 0.6}]}
          onPress={() => navigate('HomeStack', {} as any)}
        />
      )}
      {children}
    </View>
  );
};

export default EmptyPage;

const styles = StyleSheet.create({
  image: {
    width: 190,
    height: 159,
  },
  discoverProductsBtn: {
    alignSelf: 'center',
    marginTop: spacing.xxxLarge + 3,
  },
});
