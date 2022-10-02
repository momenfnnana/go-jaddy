import {useRoute, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {Text} from 'components';
import ArrowIcon from 'components/Arrow';
import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  Image,
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

const Categories = (props: ICategories) => {
  const {top} = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const {params} = useRoute<CategoryNavigationsType>();
  const {push} = useNavigation<CategoryNavigationsType>();
  const [isLoading, setisLoading] = useState(true);
  const {
    data: PerantCatData,
    isLoading: isLoadingPerantCat,
    isSuccess: isSuccessPernat,
    isError: isErrorPerant,
    error: errorPerant,
    refetch: refetchPerantCategories,
  } = useQuery(
    ['perantCategories'],
    () => getPerantCategories({pageSize: 20, page: 1}),
    {enabled: false},
  );

  const {
    data: SubCatData,
    isLoading: isLoadingSubCat,
    refetch: refetchSub,
  } = useQuery(
    ['subCategories'],
    () => getSubCategories({pageSize: 20, page: 1}),
    {enabled: false},
  );

  useEffect(() => {
    if (params?.hasSubCategory == true) {
      refetchSub();
    } else {
      refetchPerantCategories();
    }
  }, []);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: colors.primary,
          paddingTop: top + 5,
          paddingBottom: 10,
          paddingHorizontal: spacing.content,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            backgroundColor: colors.white + 18,
            padding: 10,
            borderRadius: 5,
          }}>
          <ArrowIcon />
        </Pressable>
        <Text
          tx="category.title"
          color={colors.white}
          variant="mediumRegular"
        />
        <Pressable
          style={{
            backgroundColor: colors.white + 18,
            padding: 10,
            borderRadius: 5,
            opacity: 0,
          }}>
          <ArrowIcon />
        </Pressable>
      </View>
      <FlatList
        keyExtractor={(i, _) => _.toString()}
        horizontal={false}
        data={
          isLoadingSubCat || isLoadingPerantCat
            ? [1, 2, 4, 5, 6]
            : PerantCatData?.data.Categories || SubCatData?.data.Categories
        }
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: spacing.content,
          justifyContent: 'space-between',
          paddingTop: spacing.large,
        }}
        renderItem={({item}) => {
          return (
            <Pressable
              disabled={isLoadingSubCat || isLoadingPerantCat}
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
              {isLoadingSubCat || isLoadingPerantCat ? (
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
                    visible={isLoadingSubCat || isLoadingPerantCat}
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
                    visible={isLoadingSubCat || isLoadingPerantCat}
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
