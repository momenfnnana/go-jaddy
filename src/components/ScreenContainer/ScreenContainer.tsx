import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing} from 'theme';

interface IScreenContainer {
  children: ReactNode;
  withPadding?: boolean;
}

const ScreenContainer = ({children, withPadding}: IScreenContainer) => {
  const {top, bottom} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingHorizontal: withPadding ? spacing.normal - 1 : undefined,
        },
      ]}>
      {children}
    </View>
  );
};

export default ScreenContainer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
