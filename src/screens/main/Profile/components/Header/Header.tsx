import React, {useContext, useMemo} from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import {UserContext} from 'context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from 'theme';
import {Text} from 'components';
import {BASE_URL} from 'utils/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {ProfileScreenNavigationProp} from 'navigators/NavigationsTypes';
import {setAxiosAccessToken} from 'axiosConfig';
import {useProtectedFunction} from 'hook/useProdectedFunction';
import {useLogged} from 'hook/useLogged';
import {AvatarPerson} from 'assets/images';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import appleAuth from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

const Header = () => {
  const {setUserData, setAccessToken, userData} = useContext(UserContext);
  const {isLogged} = useLogged();
  const {protectedFunction} = useProtectedFunction();
  const {navigate, dispatch} = useNavigation<ProfileScreenNavigationProp>();
  const fullName = useMemo(() => {
    if (userData?.LastName) {
      return userData?.FirstName + ' ' + userData?.LastName;
    } else {
      return userData?.FirstName;
    }
  }, [userData]);
  const logoutHandler = async () => {
    try {
      AsyncStorage.removeItem('accessToken');
      setAxiosAccessToken('');
      setUserData({});
      setAccessToken('');
      if (isLogged) {
        await GoogleSignin.signOut();
        await auth().signOut();
      }
      dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'AuthFlow', params: {screen: 'Login'}}],
        }),
      );
    } catch (error) {
      console.log('error in logout external: ', {error});
      dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'AuthFlow', params: {screen: 'Login'}}],
        }),
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.profileImageContainer}>
          {isLogged ? (
            <Image
              style={styles.profileImageContainer}
              source={
                userData?.Avatar?.Url
                  ? {uri: `${BASE_URL}${userData?.Avatar?.Url}`}
                  : AvatarPerson
              }
            />
          ) : (
            <Ionicons name="person" color={colors.white} size={28} />
          )}
        </View>
        <View style={styles.userInfoContainer}>
          <Text tx="profile.welcome" />
          <Text
            tx={isLogged ? undefined : 'profile.welcome'}
            text={isLogged ? fullName : undefined}
            variant="mediumBold"
          />
        </View>
      </View>
      <View>
        {!!userData?.UserType && (
          <View style={styles.userTypeContainer}>
            <Text text={userData?.UserType} color={colors.orange} center />
          </View>
        )}
        {isLogged ? (
          <Pressable
            onPress={logoutHandler}
            style={[styles.logoutBtnContainer, {backgroundColor: colors.red}]}>
            <Text tx="profile.logout" color={colors.white} center />
          </Pressable>
        ) : (
          <Pressable
            onPress={logoutHandler}
            style={[
              styles.logoutBtnContainer,
              {backgroundColor: colors.primary},
            ]}>
            <Text tx="profile.login" color={colors.white} center />
          </Pressable>
        )}
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
    paddingHorizontal: spacing.normal + 1,
    paddingVertical: spacing.small - 1,
    borderRadius: spacing.normal - 1,
  },
});
