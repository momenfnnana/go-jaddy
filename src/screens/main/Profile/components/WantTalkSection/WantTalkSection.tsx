import React, {useContext} from 'react';
import {Pressable, StyleSheet, View, Linking} from 'react-native';
import {Text} from 'components';
import {colors, spacing} from 'theme';
import {
  SupporCallIcon,
  SupporMailIcon,
  SupporMessangerIcon,
} from 'assets/icons';
import {UserContext} from 'context/UserContext';
enum linkHandlerTypes {
  phone,
  support,
  email,
}
const WantTalkSection = () => {
  const {settings} = useContext(UserContext);
  const onPress = (value: linkHandlerTypes) => {
    if (value === linkHandlerTypes.phone) {
      return Linking.openURL(`tel:${settings?.GlobalSettings?.PhoneNumber}`);
    } else if (value === linkHandlerTypes.support) {
      return Linking.openURL(`tel:${settings?.GlobalSettings?.PhoneNumber}`);
    } else if (value === linkHandlerTypes.email) {
      return Linking.openURL(
        `mailto:${settings?.GlobalSettings?.EmailAddress}`,
      );
    }
  };
  return (
    <View style={styles.container}>
      <Text
        tx="profile.if-want-talk"
        variant="xSmallRegular"
        color={colors.arrowColor}
      />
      <View style={styles.row}>
        <Pressable
          onPress={() => onPress(linkHandlerTypes.email)}
          style={styles.supportItemContainer}>
          <SupporMailIcon />
          <Text
            tx="profile.email"
            variant="xSmallLight"
            style={styles.supportText}
          />
        </Pressable>
        <Pressable
          onPress={() => onPress(linkHandlerTypes.support)}
          style={styles.supportItemContainer}>
          <SupporMessangerIcon />
          <Text
            tx="profile.support"
            variant="xSmallLight"
            style={styles.supportText}
          />
        </Pressable>
        <Pressable
          onPress={() => onPress(linkHandlerTypes.phone)}
          style={styles.supportItemContainer}>
          <SupporCallIcon />
          <Text
            tx="profile.direct-call"
            variant="xSmallLight"
            style={styles.supportText}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default WantTalkSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xLarge,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.small,
  },
  supportItemContainer: {
    flex: 0.32,
    paddingBottom: spacing.medium - 2,
    paddingTop: spacing.small,
    borderWidth: 0.5,
    borderColor: colors.greenSecondary,
    borderRadius: spacing.tiny + 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportText: {
    marginTop: spacing.small,
  },
});
