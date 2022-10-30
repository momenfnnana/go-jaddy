import {View, FlatList} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {BackButton, Loader, Text} from 'components';
import {useQuery} from '@tanstack/react-query';
import {getReturnProducts} from 'services/Addresses';
import {colors, spacing} from 'theme';
import moment from 'moment';

const ReturnProducts = () => {
  const {setOptions} = useNavigation();
  const {data, isLoading, isFetching} = useQuery(
    ['getReturnProducts'],
    getReturnProducts,
  );
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
    });
  }, []);

  if (isLoading || isFetching) {
    return (
      <Loader
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        size="large"
      />
    );
  }

  return (
    <View>
      <FlatList
        data={data?.data?.Items}
        keyExtractor={(i, _) => _.toString()}
        contentContainerStyle={{
          paddingHorizontal: spacing.content,
          paddingVertical: spacing.xLarge,
        }}
        renderItem={({item}) => (
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 20,
              borderRadius: 8,
              backgroundColor: colors.white,
              marginBottom: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Text
                txOptions={{orderNum: item?.OrderNumber}}
                tx="returnProducts.orderNum"
                variant="smallBold"
                numberOfLines={1}
              />
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  backgroundColor: item?.StatusColor,
                }}>
                <Text
                  text={item?.Status}
                  color={colors.white}
                  variant="xSmallBold"
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                borderBottomWidth: 0.5,
                paddingBottom: 10,

                borderBottomColor: colors.gray[300],
              }}>
              <Text
                txOptions={{orderNum: item?.OrderNumber}}
                tx="returnProducts.productName"
                variant="xSmallRegular"
                numberOfLines={1}
                style={{flex: 0.4}}
              />
              <Text
                style={{flex: 0.6}}
                variant="xSmallRegular"
                text={item?.ProductName}
                numberOfLines={1}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                borderBottomWidth: 0.5,
                paddingBottom: 10,

                borderBottomColor: colors.gray[300],
              }}>
              <Text
                txOptions={{orderNum: item?.OrderNumber}}
                tx="returnProducts.ReturnReason"
                variant="xSmallRegular"
                numberOfLines={1}
                style={{flex: 0.4}}
              />
              <Text
                style={{flex: 0.6}}
                variant="xSmallRegular"
                text={item?.ReturnReason}
                numberOfLines={1}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                borderBottomWidth: 0.5,
                paddingBottom: 10,

                borderBottomColor: colors.gray[300],
              }}>
              <Text
                txOptions={{orderNum: item?.OrderNumber}}
                tx="returnProducts.ReturnCommand"
                variant="xSmallRegular"
                numberOfLines={1}
                style={{flex: 0.4}}
              />
              <Text
                style={{flex: 0.6}}
                variant="xSmallRegular"
                text={item?.ReturnAction}
                numberOfLines={1}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                borderBottomWidth: 0.5,
                paddingBottom: 10,
                borderBottomColor: colors.gray[300],
              }}>
              <Text
                txOptions={{orderNum: item?.OrderNumber}}
                tx="returnProducts.orderDate"
                variant="xSmallRegular"
                numberOfLines={1}
                style={{flex: 0.4}}
              />
              <Text
                style={{flex: 0.6}}
                variant="xSmallRegular"
                text={moment(item?.CreatedOn).format('HH:MM ,DD/MM/YYYY')}
                numberOfLines={1}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                paddingBottom: 10,
              }}>
              <Text
                txOptions={{orderNum: item?.OrderNumber}}
                tx="returnProducts.comment"
                variant="xSmallRegular"
                numberOfLines={1}
                style={{flex: 0.4}}
              />
              <Text
                style={{flex: 0.6}}
                variant="xSmallRegular"
                text={item?.Comments}
                numberOfLines={1}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ReturnProducts;
