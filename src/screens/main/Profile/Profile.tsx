import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Loader} from 'components';
import {UserContext} from 'context/UserContext';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {Header, Section} from './components';
import {spacing} from 'theme';
import {useQuery} from '@tanstack/react-query';
import {getUserData} from 'services/Profile';
import {readAccessToken} from 'constants';
import {AuthList, UnAuthList} from './Lists';
import {useDropDownContext} from 'context/dropdownContext';

const Profile = (props: HomeNavigationsType) => {
  const {setUserData, accessToken, settings} = useContext(UserContext);
  const {setIsDropDownShown} = useDropDownContext();
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const {
    data,
    isLoading: isLoadingUserData,
    refetch,
    isRefetching,
  } = useQuery(['getUserData'], getUserData);

  const closeOpenedModals = () => {
    setIsDropDownShown(false);
  };

  useEffect(() => {
    readAccessToken().then(res => {
      if (res) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    });
  }, []);

  useEffect(() => {
    if (data) {
      setUserData(data.data);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [accessToken]);

  if (isLoadingUserData || isRefetching) {
    return <Loader size={'large'} containerStyle={styles.loader} />;
  }
  console.log({settings});

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={closeOpenedModals}>
        <View style={styles.container}>
          <Header isLogged={isLogged} />
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
