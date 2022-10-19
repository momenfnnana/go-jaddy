import React, {ReactNode} from 'react';
import {StyleSheet, TextInputProps, ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, font, spacing} from 'theme';
import {Text} from 'components';
import {TextInput} from 'react-native-paper';

interface IInputField extends TextInputProps {
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerStyle?: ViewStyle;
  placeholder?: string;
  error?: string;
  textColor?: string;
  label?: string;
  onPressRightIcon?: () => void;
  disabledRight?: boolean;
  disabledLeft?: boolean;
  onPressLeftIcon?: () => void;
}

const InputField = ({
  rightIcon,
  leftIcon,
  containerStyle,
  placeholder,
  error,
  textColor,
  onPressRightIcon,
  disabledRight,
  disabledLeft,
  onPressLeftIcon,
  label,
  ...rest
}: IInputField) => {
  const {t} = useTranslation();
  return (
    <>
      <TextInput
        mode="outlined"
        theme={{
          colors: {
            background: colors.white,
            primary: colors.secondary,
            placeholder: colors.gray[400],
          },
          fonts: {regular: {fontFamily: font.regular}},
          roundness: 8,
        }}
        label={
          label
            ? t(label)
            : placeholder
            ? t(placeholder)
            : t('common.phone-numebr')
        }
        placeholder={placeholder ? t(placeholder) : t('common.phone-numebr')}
        style={[styles.textInput, {flex: 1}]}
        autoCapitalize="none"
        {...rest}
        right={
          rightIcon && (
            <TextInput.Icon
              disabled={disabledRight}
              size={40}
              name={() => rightIcon}
              onPressRightIcon={onPressRightIcon}
            />
          )
        }
        left={
          leftIcon && (
            <TextInput.Icon
              disabled={disabledLeft}
              size={40}
              name={() => leftIcon}
              onPressRightIcon={onPressLeftIcon}
            />
          )
        }
        {...rest}
      />
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

export default InputField;
const styles = StyleSheet.create({
  textInput: {
    marginBottom: 15,
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
