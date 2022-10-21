import {useNavigation} from '@react-navigation/native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Loader, Text} from 'components';
import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  Image,
} from 'react-native';
import {FadeLoading} from 'react-native-fade-loading';
import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import {CategoryNavigationsType, IStores} from 'navigators/NavigationsTypes';
import {ActivityIndicator} from 'react-native-paper';
import {getAllStores} from 'services/Stores';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StoreDetails from '../StoreDetails/StoreDetails';

const Stores = (props: IStores) => {
  const {width} = useWindowDimensions();
  const {navigate} = useNavigation<IStores>();
  const [typeStores, setTypeStores] = useState('all');
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(
    ['AllStores'],
    ({pageParam}) =>
      getAllStores({pageParam, onlyFollowed: typeStores != 'all'}),

    {
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          return lastPage?.data?.Page + 1;
        }
        return;
      },
    },
  );

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    refetch();
  }, [typeStores]);

  if (isLoading || isRefetching) {
    return (
      <Loader
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        keyExtractor={(i, _) => _.toString()}
        horizontal={false}
        data={
          isLoading
            ? [1, 2, 4, 5, 6]
            : data?.pages.map(page => page.data.Stores).flat()
        }
        numColumns={2}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              marginBottom: 20,
            }}>
            <Pressable
              onPress={() => setTypeStores('all')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: typeStores == 'all' ? '#F3FBFF' : undefined,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor:
                  typeStores != 'all' ? colors.reloadColor : colors.transparent,
              }}>
              <Text
                tx="stores.allStores"
                variant="smallBold"
                center
                color={
                  typeStores == 'all' ? colors.primary : colors.brouwnLight
                }
              />
            </Pressable>
            <View style={{width: 10, height: 2}} />
            <Pressable
              onPress={() => setTypeStores('followed')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor:
                  typeStores == 'followed' ? '#F3FBFF' : undefined,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor:
                  typeStores != 'followed'
                    ? colors.reloadColor
                    : colors.transparent,
              }}>
              <Text
                tx="stores.FollowedStores"
                variant="smallBold"
                center
                color={
                  typeStores == 'followed' ? colors.primary : colors.brouwnLight
                }
              />
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          isFetchingNextPage
            ? () => <ActivityIndicator size={'small'} color={colors.primary} />
            : null
        }
        contentContainerStyle={{
          paddingHorizontal: spacing.content,
          justifyContent: 'space-between',
          paddingTop: spacing.large,
        }}
        renderItem={({item}) => {
          return (
            <Pressable
              onPress={() => {
                navigate('StoresDetails', {storeId: item?.Id});
              }}
              disabled={isLoading}
              key={Math.random() * 8}
              style={{
                width: width / 2 - 30,
                height: width / 2 - 60,
                backgroundColor: colors.white,
                paddingVertical: 10,
                borderRadius: 17,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                marginLeft: 10,
              }}>
              {isLoading ? (
                <>
                  <FadeLoading
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 5,
                    }}
                    children={
                      <View
                        style={{
                          width: 50,
                          height: 50,
                        }}
                      />
                    }
                    visible={isLoading}
                    animated
                    primaryColor={colors.gray[300]}
                    secondaryColor={colors.border}
                    duration={1000}
                  />
                  <FadeLoading
                    style={{
                      width: 70,
                      height: 12,
                    }}
                    children={
                      <View
                        style={{
                          width: 50,
                          height: 21,
                        }}
                      />
                    }
                    visible={isLoading}
                    animated
                    primaryColor={colors.gray[300]}
                    secondaryColor={colors.border}
                    duration={1000}
                  />
                </>
              ) : (
                <>
                  <View
                    style={{
                      padding: 10,
                      width: 80,
                      height: 80,
                      position: 'relative',
                      marginBottom: 5,
                    }}>
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={{uri: `${BASE_URL + item?.Image.Url}`}}
                      resizeMode={'contain'}
                    />
                    {item.Trusted && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          height: 16,
                          width: 16,
                          borderRadius: 8,
                          backgroundColor: colors.secondary,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name="shield-check"
                          color={colors.white}
                          size={11}
                        />
                      </View>
                    )}
                  </View>
                  <Text
                    tx={item.Name}
                    color={colors.primary}
                    variant="smallBold"
                  />
                </>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default Stores;
