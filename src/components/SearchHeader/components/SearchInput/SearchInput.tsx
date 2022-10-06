import React, {ReactNode} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, font, spacing} from 'theme';
import Text from 'components/Text';

interface ISearchInput extends TextInputProps {
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerStyle?: ViewStyle;
  placeholder?: string;
  error?: string;
  textColor?: string;
}

const SearchInput = ({
  rightIcon,
  leftIcon,
  containerStyle,
  placeholder,
  error,
  textColor,
  ...rest
}: ISearchInput) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  return (
    <>
      <View
        style={[
          styles.containerStyle,
          {justifyContent: rightIcon ? 'space-between' : 'center'},
          containerStyle,
        ]}>
        <View>{leftIcon && leftIcon}</View>
        <TextInput
          placeholder={placeholder ? t(placeholder) : t('common.phone-numebr')}
          style={[styles.textInput, {flex: 1, color: textColor}]}
          autoCapitalize="none"
          autoComplete="off"
          {...rest}
        />
        <View>{rightIcon && rightIcon}</View>
      </View>
      {error && (
        <Text
          variant="error"
          color={colors.red}
          style={{marginBottom: spacing.large}}>
          {error}
        </Text>
      )}
    </>
  );
};

export default SearchInput;
const styles = StyleSheet.create({
  textInput: {
    fontFamily: font.regular,
  },
  containerStyle: {
    borderColor: colors.reloadColor,
    borderWidth: 1,
    alignSelf: 'center',
    paddingVertical: spacing.large,
    borderRadius: spacing.small,
    paddingHorizontal: spacing.normal,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
