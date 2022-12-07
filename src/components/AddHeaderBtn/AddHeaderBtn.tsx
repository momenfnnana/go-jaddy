import React from 'react';
import {Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors, spacing} from 'theme';

interface IAddBtn {
  onPress: () => void;
  disabled?: boolean;
}

const AddHeaderBtn = ({onPress, disabled}: IAddBtn) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.white + 18,
        padding: 8,
        borderRadius: spacing.small + 2,
      }}
      disabled={disabled}>
      <AntDesign name="plus" color={colors.white} size={20} />
    </Pressable>
  );
};

export default AddHeaderBtn;
