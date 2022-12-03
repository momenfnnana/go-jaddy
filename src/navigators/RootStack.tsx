import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainNavigator} from './RoutesTypes';
import {HomeStack, AuthStack} from 'navigators';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {IScreensNames} from 'types';
import * as RootNavigation from 'navigators/RootNavigation';
import {useToast} from 'react-native-toast-notifications';

const Stack = createNativeStackNavigator<MainNavigator>();
let screenName: IScreensNames = {};
export const navigateToDirectory = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  if (!!screenName[remoteMessage.data?.Type as string].length) {
    switch (screenName[remoteMessage.data?.Type as string]) {
      case 'StoresDetails':
        RootNavigation.navigate('StoresStack', {
          screen: screenName[remoteMessage.data?.Type as string],
          params: {
            storeId: remoteMessage?.data?.EntityId,
          },
        });
        break;
      case 'CategoryDetails':
        RootNavigation.navigate('CategoriesStack', {
          screen: screenName[remoteMessage.data?.Type as string],
          params: {
            id: remoteMessage?.data?.EntityId,
          },
        });
        break;
      case 'ProductDetails':
        RootNavigation.navigate('HomeStack', {
          screen: screenName[remoteMessage.data?.Type as string],
          params: {
            Id: remoteMessage?.data?.EntityId,
          },
        });
        break;
      case 'NotificationsScreen':
        RootNavigation.navigate('ProfileStack', {
          screen: screenName[remoteMessage.data?.Type as string],
        });
        break;

      default:
        break;
    }
  }
};
const RootStack = () => {
  const {show} = useToast();
  useEffect(() => {
    screenName[10] = 'StoresDetails';
    screenName[20] = 'CategoryDetails';
    screenName[30] = 'ProductDetails';
    screenName[40] = 'NotificationsScreen';
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      show(remoteMessage?.notification?.body?.title, {
        data: remoteMessage,
      });
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      navigateToDirectory(remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      navigateToDirectory(remoteMessage);
    });
    messaging()
      .getInitialNotification()
      .then(initialMessage => {
        if (initialMessage) {
          navigateToDirectory(initialMessage);
        }
      });
    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="HomeFlow"
      screenOptions={{headerShown: false}}>
      <Stack.Screen component={HomeStack} name="HomeFlow" />
      <Stack.Screen component={AuthStack} name="AuthFlow" />
    </Stack.Navigator>
  );
};

export default RootStack;
