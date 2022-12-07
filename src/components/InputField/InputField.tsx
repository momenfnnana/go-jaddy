import React, {ReactNode} from 'react';
import {StyleSheet, TextInputProps, View, ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, font, spacing} from 'theme';
import Text from 'components/Text';
import {TextInput} from 'react-native-paper';
import {FormikErrors, FormikTouched} from 'formik';
import {useLanguage} from 'hook/useLanguage';

export interface IInputField extends TextInputProps {
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerStyle?: ViewStyle;
  placeholder?: string;
  error?: {
    touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
    value:
      | string
      | string[]
      | FormikErrors<any>
      | FormikErrors<any>[]
      | undefined;
  };
  textColor?: string;
  label?: string;
  onPressRightIcon?: () => void;
  disabledRight?: boolean;
  disabled?: boolean;
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
  disabled,
  ...rest
}: IInputField) => {
  const {t} = useTranslation();
  const {language} = useLanguage();
  return (
    <View style={containerStyle}>
      <TextInput
        disabled={disabled}
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
        placeholder={placeholder ? t(placeholder) : t('common.phone-numebr')}
        style={[
          styles.textInput,
          {flex: 1, textAlign: language === '1' ? 'left' : 'right'},
        ]}
        autoCapitalize="none"
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
      {error?.touched && error.value && (
        <Text
          variant="error"
          color={colors.red}
          style={{marginBottom: spacing.large}}>
          {error.value.toString()}
        </Text>
      )}
    </View>
  );
};

export default InputField;
const styles = StyleSheet.create({
  textInput: {
    marginBottom: 15,
  },
  // containerStyle: {
  //   borderColor: colors.reloadColor,
  //   borderWidth: 1,
  //   alignSelf: 'center',
  //   paddingVertical: spacing.large,
  //   borderRadius: spacing.small,
  //   paddingHorizontal: spacing.normal,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: colors.white,
  // },
});
