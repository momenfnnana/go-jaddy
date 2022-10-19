import React, {useLayoutEffect} from 'react';
import {View, StyleSheet, Pressable, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackButton, Loader} from 'components';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useQuery} from '@tanstack/react-query';
import {getWishlist} from 'services/Profile';
import {FreeWishlist, WishlistItem} from './components';

interface IAddBtn {
  onPress: () => void;
}

const AddBtn = ({onPress}: IAddBtn) => (
  <Pressable onPress={onPress} style={styles.addBtnContainer}>
    <AntDesign name="plus" color={colors.white} size={25} />
  </Pressable>
);

const WishList = () => {
  const {setOptions} = useNavigation();
  const onPress = () => {
    console.log('onPress');
  };
  const {data, isLoading} = useQuery(['getWishlist'], getWishlist);
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
      headerRight: () => <AddBtn onPress={onPress} />,
    });
  }, []);

  if (isLoading) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {data?.data?.Wishlists?.length > 0 ? (
        <FlatList
          data={data?.data?.Wishlists}
          keyExtractor={item => item?.Id}
          numColumns={2}
          renderItem={({item}) => <WishlistItem {...item} />}
        />
      ) : (
        <FreeWishlist />
      )}
    </View>
  );
};

export default WishList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnContainer: {
    backgroundColor: colors.white + 18,
    padding: 8,
    borderRadius: spacing.small + 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
