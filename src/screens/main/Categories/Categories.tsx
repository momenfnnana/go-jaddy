import {useRoute, useNavigation} from '@react-navigation/native';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {Loader, Text} from 'components';
import ArrowIcon from 'components/Arrow';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  Image,
  RefreshControl,
} from 'react-native';
import {FadeLoading} from 'react-native-fade-loading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getPerantCategories, getSubCategories} from 'services/Category';

import {colors, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import {
  CategoryNavigationsType,
  ICategories,
} from 'navigators/NavigationsTypes';
import {ActivityIndicator} from 'react-native-paper';

const Categories = (props: ICategories) => {
  const {top} = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const {params} = useRoute<CategoryNavigationsType>();
  const {push, navigate} = useNavigation<CategoryNavigationsType>();

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(['perantCategories'], getPerantCategories, {
    getNextPageParam: lastPage => {
      if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
        return lastPage?.data?.Page + 1;
      }
      return null;
    },
  });

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    console.log('!!!!!');
    refetch();
  }, []);

  const onRefresh = React.useCallback(() => {
    refetch();
  }, []);

  if (isLoading) {
    return (
      <Loader
        size={'large'}
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
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        keyExtractor={(i, _) => _.toString()}
        horizontal={false}
        data={
          isLoading
            ? [1, 2, 4, 5, 6]
            : data?.pages.map(page => page.data.Categories).flat()
        }
        numColumns={2}
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
              onPress={() =>
                item.HasSubCategories
                  ? push('CategoryDetails', {title: item.Name, id: item.Id})
                  : navigate('HomeStack', {
                      screen: 'SearchScreen',
                      params: {
                        categoryId: item.Id,
                        title: item.Name,
                        paramsType: 'category',
                      },
                    })
              }
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
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 5,
                    }}>
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={{uri: `${BASE_URL + item?.Image.Url}`}}
                      resizeMode={'contain'}
                    />
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

export default Categories;
