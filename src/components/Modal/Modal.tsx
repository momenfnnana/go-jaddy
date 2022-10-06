import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect} from 'react';
import {colors, spacing} from 'theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {Button, InputField, Text, Loader} from 'components';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthRoutes} from 'navigators/RoutesTypes';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {useMutation} from '@tanstack/react-query';
import {reset_password} from 'services/Auth';
import {AuthNavigationsType} from 'navigators/NavigationsTypes';
import RNModal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {postCreateWishlist} from 'services/Home';

interface IResetPasswordModalProps {
  style?: ViewStyle;
  visibleResetPasswordModal?: boolean;
  setvisibleResetPasswordModal?: (lang: boolean) => void;
  success?: (lang: boolean) => void;
  data: any[];
  isVisible: boolean;
  onBackdropPress: () => void;
  isLoading: boolean;
}

interface IinitialValues {
  email: string;
}
const ICON_WIDTH = 30;
const SIZE = 18;

const initialValues: IinitialValues = {
  email: '',
};
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('must be valid email address')
    .required('email is required'),
});
const Modal: React.FC<IResetPasswordModalProps> = ({
  visibleResetPasswordModal,
  setvisibleResetPasswordModal,
  success,
  data,
  isVisible,
  onBackdropPress,
  isLoading,
}) => {
  const {height, width} = useWindowDimensions();
  const {bottom} = useSafeAreaInsets();

  const {
    mutate,
    isLoading: isLoadingCreateWishList,
    isError,
    error,
    isSuccess,
    data: newWishlistData,
  } = useMutation(postCreateWishlist, {
    onSuccess: data => {
      return data;
    },
    onError: error => {
      return error;
    },
  });

  const addCollectionHandler = () => {
    mutate('asasd');
  };

  if (isLoading === true) {
    return <Loader size={'small'} style={styles.loader} />;
  }
  return (
    <RNModal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View
        style={[
          styles.container,
          {height: height * 0.5, width, bottom: -bottom},
        ]}>
        <View style={styles.contentConteiner}>
          <AntDesign
            name="close"
            size={spacing.xxLarge}
            color={colors.tabsColor + 40}
            style={styles.closeBtn}
            onPress={onBackdropPress}
          />
          <Text
            tx="whishlist.add"
            variant="mediumBold"
            color={colors.tabsColor}
          />
          <Text
            tx="whishlist.add-hint"
            variant="smallRegular"
            color={colors.tabsColor + 70}
            style={styles.titleHint}
          />
        </View>
        {data?.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={
              <Pressable
                onPress={addCollectionHandler}
                style={[styles.addCollectionBtnContainer, styles.row]}
                disabled={isLoadingCreateWishList}>
                <View style={styles.addCollectionBtn}>
                  {isLoadingCreateWishList ? (
                    <Loader size={'small'} color={colors.white} />
                  ) : (
                    <AntDesign name="plus" color={colors.white} size={25} />
                  )}
                </View>
                <Text
                  tx="whishlist.add-collection"
                  variant="mediumBold"
                  color={colors.primary}
                  style={styles.collectionName}
                />
              </Pressable>
            }
            renderItem={() => (
              <Pressable style={[styles.addCollectionBtnContainer, styles.row]}>
                <View style={styles.addCollectionBtn}>
                  {isLoadingCreateWishList ? (
                    <Loader size={'small'} color={colors.white} />
                  ) : (
                    <AntDesign name="plus" color={colors.white} size={25} />
                  )}
                </View>
                <Text
                  tx="whishlist.add-collection"
                  variant="mediumBold"
                  color={colors.primary}
                  style={styles.collectionName}
                />
              </Pressable>
            )}
          />
        ) : (
          <Pressable
            onPress={addCollectionHandler}
            style={[styles.addCollectionBtnContainer, styles.row]}
            disabled={isLoadingCreateWishList}>
            <View style={styles.addCollectionBtn}>
              {isLoadingCreateWishList ? (
                <Loader size={'small'} color={colors.white} />
              ) : (
                <AntDesign name="plus" color={colors.white} size={25} />
              )}
            </View>
            <Text
              tx="whishlist.add-collection"
              variant="mediumBold"
              color={colors.primary}
              style={styles.collectionName}
            />
          </Pressable>
        )}
      </View>
    </RNModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    borderRadius: spacing.small,
  },
  contentConteiner: {
    position: 'relative',
    paddingTop: spacing.normal,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.normal,
    right: spacing.normal,
  },
  titleHint: {
    paddingHorizontal: spacing.xxxLarge,
    textAlign: 'center',
    marginTop: spacing.large,
  },
  addCollectionBtnContainer: {
    paddingHorizontal: spacing.xxxLarge,
    marginTop: spacing.normal,
  },
  addCollectionBtn: {
    backgroundColor: colors.primary,
    borderRadius: spacing.medium - 2,
    height: 43,
    width: 43,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionName: {
    marginHorizontal: spacing.normal,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
