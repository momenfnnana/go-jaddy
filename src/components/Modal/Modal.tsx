import React, {ReactNode, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
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
import Fontisto from 'react-native-vector-icons/Fontisto';
import {postAddToWishlist, postCreateWishlist} from 'services/Home';
import {BASE_URL} from 'utils/Axios';

interface IResetPasswordModalProps {
  style?: ViewStyle;
  visibleResetPasswordModal?: boolean;
  setvisibleResetPasswordModal?: (lang: boolean) => void;
  success?: (lang: boolean) => void;
  data: any[];
  isVisible: boolean;
  onBackdropPress: () => void;
  forceRefetch?: () => void;
  isLoading: boolean;
  ProductId: number | string;
  title: string;
  description: string;
  children: ReactNode;
}


const ICON_WIDTH = 30;
const SIZE = 18;


const Modal: React.FC<IResetPasswordModalProps> = ({
  visibleResetPasswordModal,
  setvisibleResetPasswordModal,
  success,
  data,
  isVisible,
  onBackdropPress,
  isLoading,
  forceRefetch,
  ProductId,
  title,
  description,
  children,
}) => {
  const {height, width} = useWindowDimensions();
  const {bottom} = useSafeAreaInsets();

  return (
    <RNModal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View
        style={[
          styles.container,
          {height: height * 0.5, width, bottom: -bottom, paddingBottom: bottom},
        ]}>
        <View style={styles.contentConteiner}>
          <AntDesign
            name="close"
            size={spacing.xxLarge}
            color={colors.tabsColor + 40}
            style={styles.closeBtn}
            onPress={onBackdropPress}
          />
          <Text tx={title} variant="mediumBold" color={colors.tabsColor} />
          <Text
            tx={description}
            variant="smallRegular"
            color={colors.tabsColor + 70}
            style={styles.titleHint}
          />
        </View>
        {children}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCollectionInput: {
    height: spacing.huge,
  },
});
