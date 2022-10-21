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
import React, {useState} from 'react';
import {useQueries, useQuery} from '@tanstack/react-query';
import {
  applyDiscountCart,
  getCartProducts,
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

const Cart = () => {
  const {isLoading, isRefetching} = useQuery(
    ['cartProducts'],
    getCartProducts,
    {
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
  const [isShowModel, setShowModel] = useState<boolean>(false);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <Modal
        isVisible={isShowModel}
        onBackdropPress={() => {
          setShowModel(false);
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
                setShowModel(false);
              }}
            />
            <Button
              title="common.cancel"
              style={styles.confirmButton}
              variant="Secondary"
              color={colors.secondary}
              onPress={() => {
                setShowModel(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <FlatList
        contentContainerStyle={{
          marginHorizontal: spacing.content,
          paddingTop: 10,
        }}
        data={data?.Items}
        keyExtractor={(i, _) => _.toString()}
        renderItem={({item}) => <CartItem item={item} setData={setData} />}
      />
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : -40}>
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
            {discountCode.length > 0 && data?.DiscountBox?.IsWarning && (
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
      </KeyboardAvoidingView>
      <View style={{marginTop: 20, paddingHorizontal: spacing.content}}>
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
          />
          <Switch
            value={isUsedPoints}
            onValueChange={() => {
              if (!isFetchingApplyPoints) {
                // refetchApplyPoints();
                setShowModel(true);
              }
            }}
            color={colors.primary}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <Button title="cart.submitBtn" />
          </View>
          <View
            style={{
              marginLeft: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
            </View>
            <Text
              txOptions={{currency: currency?.Symbol}}
              text={data?.Total}
              color={colors.primary}
              variant="xLargeBold"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
