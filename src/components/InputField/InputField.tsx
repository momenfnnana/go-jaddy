import React, {ReactNode} from 'react';
import {
  View,
  StyleSheet,
  // TextInput,
  TextInputProps,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, font, spacing} from 'theme';
import Text from 'components/Text';
import {TextInput} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IInputField extends TextInputProps {
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle;
  placeholder?: string;
  error?: string;
  onPressRightIcon?: () => void;
  disabledRight?: boolean;
}

const InputField = ({
  rightIcon,
  containerStyle,
  placeholder,
  error,
  onPressRightIcon,
  disabledRight,
  ...rest
}: IInputField) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  return (
    <>
      <TextInput
        mode="outlined"
        theme={{
          colors: {
            background: colors.white,
            primary: colors.secondary,
          },
          fonts: {regular: {fontFamily: font.regular}},
        }}
        label={placeholder ? t(placeholder) : t('common.phone-numebr')}
        placeholder={placeholder ? t(placeholder) : t('common.phone-numebr')}
        style={[styles.textInput, {flex: 1}]}
        autoCapitalize="none"
        {...rest}
        right={
          <TextInput.Icon
            disabled={disabledRight}
            size={40}
            name={() => rightIcon}
            onPressRightIcon={onPressRightIcon}
          />
        }
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
