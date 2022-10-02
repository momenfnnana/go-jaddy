import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from 'theme';
import {readLanguage} from 'constants';

interface IArrowProps {
  onPress?: () => void;
  size?: number;
  color?: string;
}
const ArrowIcon = ({color = colors.white, onPress, size = 25}: IArrowProps) => {
  const [isAr, setAr] = useState(false);
  useEffect(() => {
    readLanguage().then(lang => setAr(lang == 'ar'));
  }, []);
  return (
    <MaterialIcons
      onPress={onPress}
      name="keyboard-backspace"
      size={size}
      color={color}
      style={{transform: [{rotate: isAr ? '180deg' : '0deg'}]}}
    />
  );
};

export default ArrowIcon;
