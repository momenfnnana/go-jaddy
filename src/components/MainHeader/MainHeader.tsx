import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {HeaderIcon, NotificationIcon} from 'assets/icons';
import {colors, spacing} from 'theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MainHeader = () => {
  const {top} = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const SIZE: number = width * 0.1;
  const HEADER_HEIGHT = height * 0.177;
  return (
    <View
      style={[
        styles.container,
        {
          height: HEADER_HEIGHT,
        },
      ]}>
      <View style={{width: SIZE}} />
      <HeaderIcon />
      <View style={styles.notificationIconContainer}>
        <NotificationIcon width={SIZE} />
      </View>
    </View>
  );
};

export default MainHeader;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.normal - 1,
  },
  notificationIconContainer: {
    backgroundColor: colors.white + 18,
    borderRadius: spacing.small + 2,
    height: spacing.xxxLarge + 2,
    width: spacing.xxxLarge + 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
