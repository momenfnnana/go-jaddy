import {View, Text, TextStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from 'theme';
import {readLanguage} from 'constants';
import {useLanguage} from 'hook/useLanguage';

interface IArrowProps {
  onPress?: () => void;
  size?: number;
  color?: string;
  name?: string;
  style?: TextStyle;
}
const ArrowIcon = ({
  color = colors.white,
  onPress,
  size = 25,
  name = 'keyboard-backspace',
  style,
}: IArrowProps) => {
  const {language} = useLanguage();
  
  return (
    <MaterialIcons
      onPress={onPress}
      name={name}
      size={size}
      color={color}
      style={[
        {transform: [{rotate: language === '1' ? '0deg' : '180deg'}]},
        style,
      ]}
    />
  );
};

export default ArrowIcon;
