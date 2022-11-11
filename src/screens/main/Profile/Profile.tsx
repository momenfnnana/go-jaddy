import React, {useContext, useEffect, useState} from 'react';
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

const Profile = () => {
  const {setUserData, accessToken} = useContext(UserContext);
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

  useEffect(() => {
    refetch();
  }, [accessToken]);

  if (isLoadingUserData || isRefetching) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={closeOpenedModals}>
        <View style={styles.container}>
          <Header />
          {isLogged && <Section title="screens-tabs.profile" list={AuthList} />}
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
