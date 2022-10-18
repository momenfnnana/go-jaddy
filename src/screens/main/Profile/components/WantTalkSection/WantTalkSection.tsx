import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text} from 'components';
import {colors, spacing} from 'theme';
import {
  SupporCallIcon,
  SupporMailIcon,
  SupporMessangerIcon,
} from 'assets/icons';

const WantTalkSection = () => {
  return (
    <View style={styles.container}>
      <Text
        tx="profile.if-want-talk"
        variant="xSmallRegular"
        color={colors.arrowColor}
      />
      <View style={styles.row}>
        <Pressable style={styles.supportItemContainer}>
          <SupporCallIcon />
          <Text
            tx="profile.email"
            variant="xSmallLight"
            style={styles.supportText}
          />
        </Pressable>
        <Pressable style={styles.supportItemContainer}>
          <SupporMailIcon />
          <Text
            tx="profile.support"
            variant="xSmallLight"
            style={styles.supportText}
          />
        </Pressable>
        <Pressable style={styles.supportItemContainer}>
          <SupporMessangerIcon />
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
    marginTop: spacing.small,
  },
  supportItemContainer: {
    paddingHorizontal: spacing.medium + 2,
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
