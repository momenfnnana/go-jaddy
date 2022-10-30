import {View, Text, Pressable} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors, spacing} from 'theme';

interface IAddBtn {
  onPress: () => void;
}

const AddHeaderBtn = ({onPress}: IAddBtn) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.white + 18,
        padding: 8,
        borderRadius: spacing.small + 2,
      }}>
      <AntDesign name="plus" color={colors.white} size={20} />
    </Pressable>
  );
};

export default AddHeaderBtn;
