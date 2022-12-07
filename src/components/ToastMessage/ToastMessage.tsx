import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Text from 'components/Text';
import {navigateToDirectory} from 'navigators/RootStack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ToastProps} from 'react-native-toast-notifications/lib/typescript/toast';
import {colors, font, spacing} from 'theme';

const ToastMessage = ({data}: ToastProps) => {
  const {top} = useSafeAreaInsets();
  
  return (
    <Pressable
      onPress={() => navigateToDirectory(data)}
      style={[styles.notificationContainer, {marginTop: top}]}>
      <Text style={styles.notificationTitle}>{data.notification.body}</Text>
      <Text style={styles.notificationMessage}>{data.notification.title}</Text>
    </Pressable>
  );
};

export default ToastMessage;

const styles = StyleSheet.create({
  notificationContainer: {
    paddingHorizontal: spacing.normal,
    paddingVertical: spacing.small,
    backgroundColor: colors.white,
    marginBottom: spacing.tiny,
    borderRadius: spacing.small,
    borderLeftColor: colors.green2,
    borderLeftWidth: spacing.smaller,
    justifyContent: 'center',
    paddingLeft: spacing.normal,
    width: '90%',
  },
  notificationTitle: {
    fontSize: font.size.small,
    color: '#333',
    fontWeight: 'bold',
  },
  notificationMessage: {
    color: colors.greenSecondary2,
    marginTop: 2,
  },
});
