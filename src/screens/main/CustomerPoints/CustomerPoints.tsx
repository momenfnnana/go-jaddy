import {ScrollView, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {BackButton, Loader, Text} from 'components';
import {getRewardPoints} from 'services/Addresses';
import {colors, spacing} from 'theme';
import {useCurrency} from 'hook/useCurrency';
import {Withdraw} from 'assets/images';
import WebView from 'react-native-webview';

const CustomerPoints = () => {
  const {setOptions} = useNavigation();
  const {currency} = useCurrency();
  const {data, isLoading, isFetching} = useQuery(
    ['getRewardPoints'],
    getRewardPoints,
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
    <View style={{flex: 1}}>
      {/* <ScrollView style={{width: '100%'}}> */}
        <View
          style={{
            marginTop: 30,
            marginHorizontal: spacing.content,
            flexDirection: 'row',
            padding: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: colors.secondary,
          }}>
          <View>
            <Text
              color={colors.white}
              variant="xLargeRegular"
              tx="customerPoints.points"
              txOptions={{points: data?.data?.RewardPoints}}
            />
            <Text
              color={colors.white}
              style={{marginTop: 5}}
              variant="smallLight"
              tx="customerPoints.equivalent"
              txOptions={{
                money: data?.data?.RewardPointsBalance + ' ' + currency?.Name,
              }}
            />
          </View>
          <Withdraw />
        </View>
        <WebView
          style={{
            marginHorizontal: spacing.content,
            backgroundColor: colors.transparent,
          }}
          originWhitelist={['*']}
          source={{
            html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${data?.data?.Messages}</body></html>`,
          }}
        />
      {/* </ScrollView> */}
    </View>
  );
};

export default CustomerPoints;
