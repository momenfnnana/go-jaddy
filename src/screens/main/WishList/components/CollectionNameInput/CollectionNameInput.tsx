import React, {ReactNode} from 'react';
import {
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextInput,
} from 'react-native';
import {colors, font, spacing} from 'theme';
import {useTranslation} from 'react-i18next';
import {useLanguage} from 'hook/useLanguage';
import {Text} from 'components';

interface ICollectionNameInput extends TextInputProps {
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerStyle?: ViewStyle;
  placeholder?: string;
  error?: string;
  textColor?: string;
}

const CollectionNameInput = ({
  rightIcon,
  leftIcon,
  containerStyle,
  placeholder,
  error,
  textColor,
  ...rest
}: ICollectionNameInput) => {
  const {t} = useTranslation();
  const {language} = useLanguage();
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
          style={[
            styles.textInput,
            {
              flex: 1,
              color: textColor,
              textAlign: language == '2' ? 'right' : 'left',
            },
          ]}
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

export default CollectionNameInput;
const styles = StyleSheet.create({
  textInput: {fontFamily: font.regular},
  containerStyle: {
    borderColor: colors.reloadColor,
    borderWidth: 1,
    borderRadius: spacing.small,
    paddingHorizontal: spacing.smaller,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
