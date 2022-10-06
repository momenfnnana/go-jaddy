import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdidasIcon} from 'assets/icons';
import {Text} from 'components';
import ArrowIcon from 'components/Arrow';
import React from 'react';
import {Pressable, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CategoriesScreen} from 'screens';
import Categories from 'screens/main/Categories';
import CategoryDetails from 'screens/main/CategoryDetails';
import {colors, font, spacing} from 'theme';
import {CategotyRoutes} from './RoutesTypes';

const Stack = createNativeStackNavigator<CategotyRoutes>();

const CategoriesStack = () => {
  const {top} = useSafeAreaInsets();
  return (
    <Stack.Navigator
      screenOptions={{
        // header: ({navigation, ...props}) => {
        //   const Left = (props.options as any).headerLeft;
        //   return (
        //     <View
        //       style={{
        //         backgroundColor: colors.primary,
        //         paddingTop: top + 5,
        //         paddingBottom: 10,
        //         paddingHorizontal: spacing.content,
        //         flexDirection: 'row',
        //         justifyContent: 'space-between',
        //         alignItems: 'center',
        //         height: 100,
        //         // flex: 1,
        //       }}>
        //       {/* <Pressable
        //       onPress={() => navigation.goBack()}
        //       disabled={navigation.canGoBack()}
        //       style={{
        //         backgroundColor: colors.white + 18,
        //         padding: 10,
        //         borderRadius: 5,
        //         opacity: navigation.canGoBack() ? 1 : 0,
        //       }}>
        //       <ArrowIcon />
        //     </Pressable> */}
        //       <View style={{width: 150, flexDirection: 'row'}}>
        //         {Left != undefined && <Left />}
        //       </View>
        //       <Text
        //         tx={props.options.title || 'category.title'}
        //         color={colors.white}
        //         variant="mediumRegular"
        //         center
        //       />
        //       <View style={{width: 150, flexDirection: 'row', opacity: 0}}>
        //         {Left != undefined && <Left />}
        //       </View>
        //       {/* <Pressable
        //       style={{
        //         backgroundColor: colors.white + 18,
        //         padding: 10,
        //         borderRadius: 5,
        //         opacity: 0,
        //       }}>
        //       <ArrowIcon />
        //     </Pressable> */}
        //     </View>
        //   );
        // },
        headerStyle: {backgroundColor: colors.primary},
        headerTitleStyle: {fontFamily: font.regular, color: colors.white},
      }}>
      <Stack.Screen component={Categories} name="Categories" />
      <Stack.Screen
        component={CategoryDetails}
        name="CategoryDetails"
        initialParams={{title: '', id: -1}}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
