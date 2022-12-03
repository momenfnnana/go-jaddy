import React from 'react';
import {StyleSheet, View, useWindowDimensions, Pressable} from 'react-native';
import {HeaderIcon, NotificationIcon} from 'assets/icons';
import {colors, spacing} from 'theme';
import {useNavigation} from '@react-navigation/native';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';

const MainHeader = () => {
  const {navigate} = useNavigation<HomeNavigationsType>();
  const {width, height} = useWindowDimensions();
  const SIZE: number = width * 0.1;
  const HEADER_HEIGHT = height * 0.177;
  const goToNotifications = () => {
    navigate('ProfileStack', {
      screen: 'NotificationsScreen',
    } as any);
  };

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
      <Pressable
        onPress={goToNotifications}
        style={styles.notificationIconContainer}>
        <NotificationIcon width={SIZE} />
      </Pressable>
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
