import React, {ReactNode} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {colors, spacing} from 'theme';

import {Text} from 'components';
import RNModal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

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
  containerStyle: ViewStyle;
}

const ICON_WIDTH = 30;
const SIZE = 18;

const Modal: React.FC<IResetPasswordModalProps> = ({
  setvisibleResetPasswordModal,
  success,
  isVisible,
  onBackdropPress,
  forceRefetch,
  title,
  description,
  children,
  containerStyle,
}) => {
  const {width} = useWindowDimensions();
  const {bottom} = useSafeAreaInsets();
  const isAndroid = Platform.OS === 'android';
  return isAndroid ? (
    <KeyboardAvoidingView behavior={'position'}>
      <RNModal
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        style={[
          styles.container,
          containerStyle,
          {
            width,
            bottom: 0,
            paddingBottom: 20,
          },
        ]}>
        <View style={{paddingBottom: bottom}}>
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
    </KeyboardAvoidingView>
  ) : (
    <RNModal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={[
          styles.container,
          containerStyle,
          {
            width,
            bottom: -bottom,
          },
        ]}>
        <View style={{paddingBottom: bottom}}>
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
      </KeyboardAvoidingView>
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
