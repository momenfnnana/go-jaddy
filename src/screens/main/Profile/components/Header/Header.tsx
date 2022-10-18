import React, {useContext, useEffect, useMemo, useState} from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import {UserContext} from 'context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from 'theme';
import {Text} from 'components';
import {BASE_URL} from 'utils/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IHeader {
  isLogged: boolean;
}

const Header = ({isLogged}: IHeader) => {
  const {setUserData, setAccessToken, userData} = useContext(UserContext);
  const logoutHandler = () => {
    AsyncStorage.removeItem('accessToken');
    setUserData({});
    setAccessToken(null);
  };
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.profileImageContainer}>
          {isLogged ? (
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
            tx={isLogged ? undefined : 'profile.welcome'}
            text={
              isLogged
                ? userData?.FirstName + ' ' + userData?.LastName
                : undefined
            }
            variant="mediumBold"
          />
        </View>
      </View>
      <View>
        <View style={styles.userTypeContainer}>
          <Text tx="profile.buyer-account" color={colors.orange} center />
        </View>
        <Pressable onPress={logoutHandler} style={styles.logoutBtnContainer}>
          <Text tx="profile.logout" color={colors.white} center />
        </Pressable>
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
    justifyContent: 'space-between',
  },
  subContainer: {
    flex: 1,
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
  userTypeContainer: {
    backgroundColor: colors.orange + 11,
    paddingHorizontal: spacing.normal + 1,
    paddingVertical: spacing.small - 1,
    borderRadius: spacing.normal - 1,
    marginBottom: spacing.small,
  },
  logoutBtnContainer: {
    backgroundColor: colors.red,
    paddingHorizontal: spacing.normal + 1,
    paddingVertical: spacing.small - 1,
    borderRadius: spacing.normal - 1,
  },
});
