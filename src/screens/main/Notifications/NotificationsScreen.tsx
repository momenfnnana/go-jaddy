import React, {useEffect, useLayoutEffect} from 'react';
import {View, StyleSheet, FlatList, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PreviousAddressNavigationProp} from 'navigators/NavigationsTypes';
import {BackButton, Loader, Text} from 'components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from 'theme';
import {getNotifications} from 'services/Profile';
import {useQuery} from '@tanstack/react-query';
import {IScreensNames} from 'types';
import * as RootNavigation from 'navigators/RootNavigation';

interface INotificationItem {
  Id: number;
  Type: number;
  EntityId: number;
  Subject: string;
  Message: string;
  NotificationDate: Date;
}

let screenName: IScreensNames = {};

const NotificationItem = ({
  Subject,
  Message,
  Id,
  NotificationDate,
  Type,
  EntityId,
}: INotificationItem) => {
  useEffect(() => {
    screenName[10] = 'StoresDetails';
    screenName[20] = 'CategoryDetails';
    screenName[30] = 'ProductDetails';
    screenName[40] = 'NotificationsScreen';
  }, []);
  const navigateToDirectory = () => {
    switch (screenName[Type]) {
      case 'StoresDetails':
        RootNavigation.navigate('StoresStack', {
          screen: screenName[Type],
          params: {
            storeId: EntityId,
          },
        });
        break;
      case 'CategoryDetails':
        RootNavigation.navigate('CategoriesStack', {
          screen: screenName[Type],
          params: {
            id: EntityId,
          },
        });
        break;
      case 'ProductDetails':
        RootNavigation.navigate('HomeStack', {
          screen: screenName[Type],
          params: {
            Id: EntityId,
          },
        });
        break;
      case 'NotificationsScreen':
        RootNavigation.navigate('ProfileStack', {
          screen: screenName[Type],
        });
        break;
      default:
        break;
    }
  };
  return (
    <Pressable
      onPress={navigateToDirectory}
      style={styles.notificationContainer}>
      <View style={styles.notificationIconContainer}>
        <Ionicons
          name="notifications-outline"
          size={20}
          color={colors.secondary}
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <View style={styles.textContainer}>
          <Text
            text={Subject}
            variant="mediumLight"
            style={styles.notificationTitle}
            color={colors.tabsColor}
          />
          <Text
            text={Message}
            variant="mediumRegular"
            style={styles.notificationDescription}
            color={colors.tabsColor}
          />
        </View>
        <Text
          text={NotificationDate.toString()}
          variant="xSmallLight"
          style={styles.date}
          numberOfLines={1}
          color={colors.brouwnLight}
        />
      </View>
    </Pressable>
  );
};

const NotificationsScreen = () => {
  const {setOptions} = useNavigation<PreviousAddressNavigationProp>();
  const {data: notificationsData, isLoading} = useQuery(
    ['getNotifications'],
    getNotifications,
  );

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
    });
  }, []);
  if (isLoading) {
    return <Loader isPageLoading />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={notificationsData?.data?.Notifications}
        keyExtractor={item => item.Id.toString()}
        renderItem={({item}) => <NotificationItem {...item} />}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '90%',
    alignSelf: 'center',
    marginTop: spacing.medium - 2,
    borderRadius: spacing.medium - 2,
    padding: spacing.normal,
  },
  notificationIconContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    marginRight: spacing.normal,
    borderRadius: spacing.tiny + 1,
    padding: spacing.medium - 2,
  },
  textContainer: {
    flex: 0.7,
  },
  notificationTitle: {
    flex: 1,
  },
  notificationDescription: {
    flex: 1,
  },
  date: {
    flex: 0.2,
  },
});
