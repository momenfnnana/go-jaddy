import React, {useContext, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Loader, Text} from 'components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from 'context/UserContext';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {Header, Section, Tab} from './components';
import {spacing} from 'theme';
import {useQuery} from '@tanstack/react-query';
import {getUserData} from 'services/Auth';
import {readAccessToken} from 'constants';
import {UnAuthList} from './Lists';

const Profile = (props: HomeNavigationsType) => {
  const {setUserData, setAccessToken} = useContext(UserContext);
  const {navigate} = useNavigation<HomeNavigationsType>();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const {
    data,
    isSuccess,
    isLoading: isLoadingUserData,
  } = useQuery(['getUserData'], getUserData);
  const logoutHandler = () => {
    AsyncStorage.clear();
    setUserData({});
    setAccessToken('');
  };

  useEffect(() => {
    readAccessToken().then(res => {
      if (res) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    });
  }, []);

  useEffect(() => {
    if (data) {
      setUserData(data.data);
    }
  }, [data]);

  if (isLoadingUserData) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Header isRegistered={isRegistered} />
        {isRegistered && (
          <Section title="screens-tabs.profile" list={UnAuthList} />
        )}
        <Pressable onPress={logoutHandler}>
          <Text text="Logout" />
        </Pressable>
      </View>
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
