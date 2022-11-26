import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {colors, spacing} from 'theme';
import {BackButton, Text} from 'components';
import {GoJaddyFullLogo} from 'assets/images';

const AboutTheAppHeader = ({title}: {title?: string}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleAndBtnContainer}>
        <View>
          <BackButton />
        </View>
        {title ? (
          <Text color={colors.white} text={title} />
        ) : (
          <Text color={colors.white} tx="profile.about-the-app" />
        )}
        <View style={styles.emptySpace} />
      </View>
      <Image
        source={GoJaddyFullLogo}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default AboutTheAppHeader;

const styles = StyleSheet.create({
  container: {
    height: 238,
    backgroundColor: colors.primary,
    paddingTop: 70,
    alignItems: 'center',
  },
  emptySpace: {
    width: spacing.xxxLarge,
  },
  titleAndBtnContainer: {
    flex: 1,
    paddingHorizontal: spacing.medium,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  logo: {
    width: 149.76,
    height: 100,
  },
});
