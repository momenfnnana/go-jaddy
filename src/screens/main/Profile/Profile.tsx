import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Loader} from 'components';
import {UserContext} from 'context/UserContext';
import {Header, Section} from './components';
import {spacing} from 'theme';
import {useQuery} from '@tanstack/react-query';
import {getUserData} from 'services/Profile';
import {AuthList, UnAuthList} from './Lists';
import {useDropDownContext} from 'context/dropdownContext';
import {useLogged} from 'hook/useLogged';
import {useNavigation} from '@react-navigation/native';

const Profile = () => {
  const {setOptions} = useNavigation();
  const {setUserData, accessToken, userData} = useContext(UserContext);
  const {isLogged} = useLogged();
  const {setIsDropDownShown} = useDropDownContext();
  const {
    isLoading: isLoadingUserData,
    refetch,
    isRefetching,
  } = useQuery(['getUserData'], getUserData, {
    enabled: false,
    onSuccess: data => {
      setUserData(data.data);
      return data;
    },
  });

  const closeOpenedModals = () => {
    setIsDropDownShown(false);
  };
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <></>,
    });
  }, []);
  useEffect(() => {
    if (isLogged && userData.IsGuestUser !== true) {
      refetch();
    }
  }, [isLogged, userData.IsGuestUser]);

  if (isRefetching) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={closeOpenedModals}>
        <View style={styles.container}>
          <Header />
          {isLogged && userData?.IsGuestUser !== true && (
            <Section
              title="screens-tabs.profile"
              list={AuthList({
                userType: userData?.UserType,
                isGuest: userData?.IsGuestUser,
              })}
            />
          )}
          <Section
            title={isLogged ? 'profile.others' : undefined}
            list={UnAuthList}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.normal,
    marginTop: spacing.large,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
