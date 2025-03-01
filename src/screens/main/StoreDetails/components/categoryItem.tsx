import {FlatList, Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from 'theme';
import {Loader, Text, ArrowIcon} from 'components';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getSubCategories} from 'services/Category';
import {readLanguage} from 'constants';
interface ICategoryItem {
  setCatProductId: (() => void) | any;
  setSubCatId: (() => void) | any;
  item: any;
}
const CategoryItem = ({item, setCatProductId, setSubCatId}: ICategoryItem) => {
  const [show, setShow] = useState(false);
  const [isAr, setAr] = useState(false);
  useEffect(() => {
    readLanguage().then(lang => setAr(lang == 'ar'));
  }, []);
  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery(
    [`StoreSubCategory${item?.Id}`],
    ({pageParam}) => getSubCategories({categoryId: item?.Id, pageParam}),
    {
      enabled: false,
      cacheTime: 0,
      getNextPageParam: lastPage => {
        if (lastPage?.data?.Page < lastPage?.data?.TotalPages) {
          return lastPage?.data?.Page + 1;
        }
        return null;
      },
    },
  );

  return (
    <View>
      <Pressable
        onPress={() => {
          if (item.HasSubCategories) {
            refetch();
            setShow(!show);
          } else {
            setCatProductId(item.Id);
            setSubCatId(-2);
          }
        }}
        style={{
          borderBottomWidth: 1,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomColor: colors.border,
          marginBottom: 10,
        }}>
        <Text
          tx={item.Name}
          color={item.HasSubCategories ? colors.primary : colors.black}
          variant="smallRegular"
        />
        <ArrowIcon
          name={`keyboard-arrow-${show ? (isAr ? 'up' : 'down') : 'right'}`}
          size={18}
          color={item?.HasSubCategories ? colors.primary : colors.black}
        />
        {/* <MaterialIcons
          name={`keyboard-arrow-${show ? 'down' : 'right'}`}
          size={18}
          color={item.HasSubCategories ? colors.primary : colors.black}
        /> */}
      </Pressable>
      {isSuccess &&
        show &&
        (!isLoading && !isFetching ? (
          <FlatList
            data={data?.pages.map(page => page.data?.Categories).flat()}
            renderItem={({item}: any) => (
              <Pressable
                onPress={() => {
                  if (item?.HasSubCategories) {
                  } else {
                    setCatProductId(item.Id);
                    setSubCatId(-2);
                  }
                }}
                style={{
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottomColor: colors.border,
                  marginBottom: 10,
                  marginHorizontal: 10,
                }}>
                <Text
                  tx={item?.Name}
                  color={item?.HasSubCategories ? colors.primary : colors.black}
                  variant="smallRegular"
                />
                <ArrowIcon
                  name={`keyboard-arrow-right`}
                  size={18}
                  color={item?.HasSubCategories ? colors.primary : colors.black}
                />
              </Pressable>
            )}
          />
        ) : (
          <Loader size={'small'} color={colors.primary} />
        ))}
    </View>
  );
};

export default CategoryItem;
