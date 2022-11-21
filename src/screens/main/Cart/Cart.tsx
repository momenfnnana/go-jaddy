import {
  View,
  FlatList,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useQueries, useQuery} from '@tanstack/react-query';
import {
  applyDiscountCart,
  getCartProducts,
  getCartSummary,
  removeDiscountCart,
  togglePointsCart,
} from 'services/Cart';
import {colors, font, spacing} from 'theme';
import {BASE_URL} from 'utils/Axios';
import {Button, InputField, Loader, Modal, Text} from 'components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from 'react-native-paper';
import {useCurrency} from 'hook/useCurrency';
import CartItem from './components/CartItem';
import {useTranslation} from 'react-i18next';
import Entypo from 'react-native-vector-icons/Entypo';
import {GoJaddyRedIcon} from 'assets/icons';
import {SuccessModalImg} from 'assets/images';
import EmptyPage from 'components/EmptyPage/EmptyPage';
import {useLogged} from 'hook/useLogged';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CART} from 'types';
import {UserContext} from 'context/UserContext';
import {useNavigation} from '@react-navigation/native';
import {CartScreenNavigationProp} from 'navigators/NavigationsTypes';

const Cart = () => {
  const {navigate} = useNavigation<CartScreenNavigationProp>();
  const {updateProducts} = useContext(UserContext);
  const {isLogged} = useLogged();
  const {isLoading, isFetching, isRefetching, isError} = useQuery(
    ['cartProducts'],
    getCartProducts,
    {
      enabled: isLogged || false,
      onSuccess(data) {
        setData(data.data);
        setUsedPoints(data.data?.RewardPoints?.UseRewardPoints);
      },
    },
  );
  const [data, setData] = useState<any>({});
  const {t} = useTranslation();
  const [discountCode, setDiscountCode] = useState<string>('');
  const [isUsedPoints, setUsedPoints] = useState<boolean>(false);
  const [isShowPointsModel, setShowPointsModel] = useState<boolean>(false);
  const [isShowSummaryModel, setShowSummaryModel] = useState<boolean>(false);
  const [localData, setLocalData] = useState<any[]>([]);
  const {currency} = useCurrency();

  const {
    isLoading: isLoadingApplyDis,
    isRefetching: isRefetchingApplyDis,
    refetch: refetchApplyDis,
  } = useQuery(['applyDiscountCart'], () => applyDiscountCart(discountCode), {
    enabled: false,
    onSuccess(data) {
      setData(data.data);
    },
  });

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isFetching: isFetchingSummary,
    refetch: refetchSummary,
  } = useQuery(['applyCartSummary'], getCartSummary, {
    enabled: false,
  });

  const {
    isLoading: isLoadingRemoveDis,
    isRefetching: isRefetchingRemoveDis,
    refetch: refetchRemoveDis,
  } = useQuery(['RemoveDiscountCart'], () => removeDiscountCart(), {
    enabled: false,
    onSuccess(data) {
      setData(data.data);
      setDiscountCode('');
    },
  });

  const {
    isLoading: isLoadingApplyPoints,
    isFetching: isFetchingApplyPoints,
    refetch: refetchApplyPoints,
  } = useQuery(
    ['applyPointscountCart'],
    () => togglePointsCart(!isUsedPoints),
    {
      enabled: false,
      onSuccess(data) {
        setData(data.data);
        onUsedPoints();
      },
    },
  );

  const onUsedPoints = () => {
    setUsedPoints(!isUsedPoints);
  };
  const onSubmit = () => {
    navigate('ContinueOrderSteps', {
      skip: {
        SkipAddressesStep: data.SkipAddressesStep,
        SkipPaymentStep: data.SkipPaymentStep,
        SkipShippingStep: data.SkipShippingStep,
      },
    });
  };

  useEffect(() => {
    if (!isLogged) {
      (async () => {
        const cartItems = await AsyncStorage.getItem(CART);
        const cartArray = JSON.parse(cartItems as any) as any[];
        if (cartArray) {
          setLocalData(cartArray);
        }
      })();
    }
  }, [isLogged, updateProducts]);

  if ((isLoading && isLogged) || (isFetching && !isLogged) || isRefetching) {
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

  if (
    (isLogged &&
      (data?.Items?.length == 0 || data?.Items?.length == undefined)) ||
    (!isLogged && localData?.length == 0)
  ) {
    return (
      <View style={{flex: 1}}>
        <EmptyPage
          descritopn="go to home to discover products"
          title="No products in your cart"
          displayButton
        />
      </View>
    );
  }

  const cartProducts = () => {
    if (!isLogged) {
      return localData;
    } else {
      return data?.Items;
    }
  };

  return (
    <View style={{flex: 1}}>
      <Modal
        isVisible={isShowPointsModel}
        onBackdropPress={() => {
          setShowPointsModel(false);
        }}
        title=""
        showCloseBtn={false}>
        <View style={styles.modalContent}>
          {isUsedPoints ? (
            <GoJaddyRedIcon style={styles.redIcon} />
          ) : (
            <SuccessModalImg style={styles.redIcon} />
          )}
          <Text
            tx={`modal.${!isUsedPoints ? 'successTitle' : 'faildTitle'}`}
            variant="xLargeBold"
            color={!isUsedPoints ? colors.success : colors.red}
            center
          />
          <Text
            tx={data?.RewardPoints?.RewardPointsMessage}
            variant="smallRegular"
            color={colors.modalDescriptionColor}
            center
          />
          <View style={styles.row}>
            <Button
              title="common.continue"
              style={styles.confirmButton}
              onPress={() => {
                refetchApplyPoints();
                setShowPointsModel(false);
              }}
            />
            <Button
              title="common.cancel"
              style={styles.confirmButton}
              variant="Secondary"
              color={colors.secondary}
              onPress={() => {
                setShowPointsModel(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isShowSummaryModel}
        onBackdropPress={() => {
          setShowSummaryModel(false);
        }}
        title=""
        showCloseBtn={false}>
        <View style={styles.modalContent}>
          <Text tx={`modal.BillTitle`} variant="xLargeBold" center />
          {isLoadingSummary || isFetchingSummary ? (
            <Loader
              containerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.border,
                  marginTop: 20,
                }}>
                <Text variant="mediumRegular" tx="modal.TotalProducts" />
                <Text
                  variant="mediumRegular"
                  text={summaryData?.data?.SubTotal}
                />
              </View>
              {summaryData?.data?.RewardPointsAmount && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.border,
                    marginTop: 10,
                  }}>
                  <Text variant="mediumRegular" tx="modal.RewardPoints" />
                  <Text
                    variant="mediumRegular"
                    text={summaryData?.data?.RewardPointsAmount}
                  />
                </View>
              )}
              {summaryData?.data?.OrderTotalDiscount && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.border,
                    marginTop: 10,
                  }}>
                  <Text variant="mediumRegular" tx="modal.DiscoundCode" />
                  <Text
                    variant="mediumRegular"
                    text={summaryData?.data?.OrderTotalDiscount}
                  />
                </View>
              )}
              {summaryData?.data?.Tax?.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.border,
                    marginTop: 10,
                  }}>
                  <Text variant="mediumRegular" tx="modal.tax" />
                  <Text variant="mediumRegular" text={summaryData?.data?.Tax} />
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                  marginTop: 10,
                }}>
                <Text
                  variant="mediumBold"
                  color={colors.secondary}
                  tx="modal.total"
                />
                <Text
                  variant="mediumBold"
                  color={colors.secondary}
                  text={summaryData?.data?.OrderTotal}
                />
              </View>
            </>
          )}
          <Button
            title="modal.submitTotalModal"
            style={{
              marginTop: spacing.xxxLarge + 2,
              marginBottom: spacing.xxLarge + 2,
            }}
            onPress={() => {
              // refetchApplyPoints();
              onSubmit();
              setShowPointsModel(false);
            }}
          />
        </View>
      </Modal>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: spacing.content,
          paddingTop: 10,
        }}
        data={cartProducts()}
        keyExtractor={(i, _) => _.toString()}
        renderItem={({item}) => <CartItem item={item} setData={setData} />}
      />
      {isLogged && (
        <View style={{marginTop: 20, paddingHorizontal: spacing.content}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text tx="cart.discountCode" variant="smallRegular" size={14} />
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: '#EEEEEE',
              }}>
              <Text
                size={12}
                tx="cart.useDiscountCode"
                color={colors.secondary}
                variant="smallBold"
              />
            </View>
          </View>
          <View
            style={{
              height: 50,
              borderRadius: 6,
              borderWidth: 1.5,
              borderColor: colors.secondary,
              borderStyle: 'dashed',
              backgroundColor: '#4B95550F',
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            <TextInput
              value={discountCode}
              onChangeText={setDiscountCode}
              placeholder={t('cart.discountPlaceholder')}
              style={{
                flex: 1,
                height: '100%',
                fontFamily: font.regular,
                paddingHorizontal: 10,
              }}
            />
            {discountCode.length > 0 && !data?.DiscountBox?.IsWarning && (
              <Pressable
                onPress={() => {
                  refetchApplyDis();
                }}
                disabled={isRefetchingApplyDis}>
                <MaterialCommunityIcons
                  name="check"
                  color={colors.success}
                  size={14}
                  style={{
                    padding: 2,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.success,
                    marginLeft: 10,
                  }}
                />
              </Pressable>
            )}
            {data?.DiscountBox?.IsWarning && (
              <Pressable
                onPress={() => refetchRemoveDis()}
                disabled={isRefetchingRemoveDis}>
                <Entypo name="circle-with-cross" color={colors.red} size={24} />
              </Pressable>
            )}
            <MaterialCommunityIcons
              name="percent"
              color={colors.secondary}
              size={14}
              style={{
                padding: 2,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.secondary,
                marginHorizontal: 10,
              }}
            />
          </View>
        </View>
      )}
      <View style={{marginTop: 20, paddingHorizontal: spacing.content}}>
        {isLogged && data?.RewardPoints.DisplayRewardPoints && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              tx={data?.RewardPoints?.RewardPointsMessage}
              variant="smallRegular"
              style={{marginBottom: -spacing.large}}
            />
            <Switch
              style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
              value={isUsedPoints}
              onValueChange={() => {
                if (!isFetchingApplyPoints) {
                  // refetchApplyPoints();
                  setShowPointsModel(true);
                }
              }}
              color={colors.primary}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <Button title="cart.submitBtn" onPress={onSubmit} />
          </View>
          {isLogged && (
            <View
              style={{
                marginLeft: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Pressable
                onPress={() => {
                  refetchSummary();
                  setShowSummaryModel(true);
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  name={`keyboard-arrow-down`}
                  size={18}
                  color={colors.black}
                />
                <Text
                  txOptions={{currency: currency?.Symbol}}
                  tx="cart.total"
                  color={colors.reloadColor}
                  variant="xSmallRegular"
                />
              </Pressable>
              <Text
                txOptions={{currency: currency?.Symbol}}
                text={data?.Total}
                color={colors.primary}
                variant="xLargeBold"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  redIcon: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xxxLarge + 2,
    marginBottom: spacing.xxLarge + 2,
  },
  confirmButton: {
    width: '48%',
  },
  modalContent: {
    paddingHorizontal: spacing.large - 2,
  },
});

export default Cart;
