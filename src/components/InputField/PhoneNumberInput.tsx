import React, {useState} from 'react';
import {
  Pressable,
  Image,
  StyleSheet,
  ImageSourcePropType,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import InputField, {IInputField} from './InputField';
import Text from '../Text';
import {colors, spacing} from '../../theme';
import {PalestineFlag} from 'assets/images';
import {ICON_WIDTH} from 'screens/Onboading/Login/Login';
import CountryPicker from 'components/CountryPicker';

export interface IFlag {
  imageUrl: ImageSourcePropType;
  introructionNumber: string;
  countryName: 'Palestine' | 'Israel';
}
interface IPhoneNumberInput extends IInputField {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  errorValue?: string;
  errorTouched?: boolean;
  onChangeCountry: (value: string) => void;
}
const SIZE = 18;
const flags: IFlag[] = [
  {
    imageUrl: PalestineFlag,
    introructionNumber: '970',
    countryName: 'Palestine',
  },
  {
    imageUrl: PalestineFlag,
    introructionNumber: '972',
    countryName: 'Israel',
  },
];

const PhoneNumberInput = ({
  value,
  onChangeText,
  onBlur,
  errorValue,
  errorTouched,
  onChangeCountry,
  ...rest
}: IPhoneNumberInput) => {
  const [selectedFlag, setSelectedFlag] = useState<IFlag>(flags[0]);
  const [isFlagsShown, setIsFlagsShown] = useState<boolean>(false);
  const showCountries = () => {
    setIsFlagsShown(true);
  };
  const hideCountries = () => {
    setIsFlagsShown(false);
  };
  const onSelectCountry = (value: IFlag) => {
    setSelectedFlag(value);
    onChangeCountry(value.introructionNumber);
  };

  return (
    <>
      <InputField
        value={value}
        keyboardType="phone-pad"
        onChangeText={onChangeText}
        onBlur={onBlur}
        error={{
          value: errorValue,
          touched: errorTouched,
        }}
        rightIcon={
          <Pressable onPress={showCountries} style={styles.row}>
            <Text
              text={selectedFlag.introructionNumber}
              variant="smallRegular"
              color={colors.brouwnLight}
              size={11}
            />
            <Image
              source={selectedFlag.imageUrl}
              style={[styles.flag, styles.introNumber]}
              resizeMode="center"
            />
          </Pressable>
        }
        containerStyle={styles.inputContainer}
        {...rest}
      />
      <CountryPicker
        flags={flags}
        hideCountries={hideCountries}
        isFlagsShown={isFlagsShown}
        onSelectCountry={onSelectCountry}
      />
    </>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  flag: {
    width: SIZE,
    height: SIZE,
  },
  introNumber: {
    maxWidth: ICON_WIDTH,
    minWidth: ICON_WIDTH,
  },
  inputContainer: {
    marginBottom: spacing.medium - 2,
  },
});
