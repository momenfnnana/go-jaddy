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
import {colors, spacing} from 'theme';

interface IInputField extends TextInputProps {
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle;
  placeholder?: string;
}

const InputField = ({
  rightIcon,
  containerStyle,
  placeholder,
  ...rest
}: IInputField) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  return (
    <View
      style={[
        styles.containerStyle,
        {justifyContent: rightIcon ? 'space-between' : 'center'},
        containerStyle,
      ]}>
      <TextInput
        placeholder={placeholder ? t(placeholder) : t('common.phone-numebr')}
        style={[styles.textInput, {width: width * 0.65}]}
        {...rest}
      />
      <View style={{width: width * 0.2}}>{rightIcon && rightIcon}</View>
    </View>
  );
};

export default InputField;
const styles = StyleSheet.create({
  textInput: {},
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
