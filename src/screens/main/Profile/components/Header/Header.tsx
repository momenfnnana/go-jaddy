import React, {useContext, useEffect, useMemo, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {UserContext} from 'context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from 'theme';
import {Text} from 'components';
import {BASE_URL} from 'utils/Axios';

interface IHeader {
  isRegistered: boolean;
}

const Header = ({isRegistered}: IHeader) => {
  const {userData} = useContext(UserContext);

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {isRegistered ? (
          <Image
            style={styles.profileImageContainer}
            source={{uri: `${BASE_URL}${userData?.Avatar?.Url}`}}
          />
        ) : (
          <Ionicons name="person" color={colors.white} size={28} />
        )}
      </View>
      <View style={styles.userInfoContainer}>
        <Text tx="profile.welcome" />
        <Text
          tx={isRegistered ? undefined : 'profile.welcome'}
          text={
            isRegistered
              ? userData?.FirstName + ' ' + userData?.LastName
              : undefined
          }
          variant="mediumBold"
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 0.15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    backgroundColor: colors.primary,
    height: spacing.huge + 5,
    width: spacing.huge + 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.huge,
  },
  userInfoContainer: {
    marginLeft: spacing.normal,
  },
});
