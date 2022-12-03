import React, {useLayoutEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PreviousAddressNavigationProp} from 'navigators/NavigationsTypes';
import {BackButton, Loader, Text} from 'components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from 'theme';
import {getNotifications} from 'services/Profile';
import {useQuery} from '@tanstack/react-query';

interface INotificationItem {
  Id: number;
  Type: number;
  EntityId: number;
  Subject: string;
  Message: string;
  date: Date;
}
enum NotificationType {
  Store = 10,
  Category = 20,
  Product = 30,
  General = 40,
}
const data: INotificationItem[] = [
  {
    Id: 1,
    Type: 10,
    EntityId: 6,
    Subject: 'New Store | Testing',
    Message: 'descriptiondescriptiondescriptiondescription',
    date: new Date(),
  },
  {
    Id: 2,
    Type: 10,
    EntityId: 6,
    Subject: 'New Store | Testing',
    Message: 'descriptiondescriptiondescriptiondescription',
    date: new Date(),
  },
  {
    Id: 3,
    Type: 10,
    EntityId: 6,
    Subject: 'New Store | Testing',
    Message: 'descriptiondescriptiondescriptiondescription',
    date: new Date(),
  },
  {
    Id: 4,
    Type: 10,
    EntityId: 6,
    Subject: 'New Store | Testing',
    Message: 'descriptiondescriptiondescriptiondescription',
    date: new Date(),
  },
];
console.log({NotificationType:NotificationType.Category});

const NotificationItem = ({Subject, Message, Id, date}: INotificationItem) => {
  return (
    <View style={styles.notificationContainer}>
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
          text={date.toString()}
          variant="xSmallLight"
          style={styles.date}
          numberOfLines={1}
          color={colors.brouwnLight}
        />
      </View>
    </View>
  );
};

const NotificationsScreen = () => {
  const {setOptions} = useNavigation<PreviousAddressNavigationProp>();
  // const {data: notificationsData, isLoading} = useQuery(
  //   ['getNotifications'],
  //   getNotifications,
  // );

  // if (isLoading) {
  //   return <Loader isPageLoading />;
  // }
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
    });
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
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
