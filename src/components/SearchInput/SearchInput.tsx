import React, {useState} from 'react';
import {View, StyleSheet, TextInput, ViewStyle, Pressable} from 'react-native';
import {colors, spacing} from 'theme';
import {t} from 'i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeRoutes} from 'navigators/RoutesTypes';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';

interface ISearchInput {
  containerStyle: ViewStyle;
}
const SearchInput = ({containerStyle}: ISearchInput) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const {navigate} = useNavigation<HomeNavigationsType>();
  const onPressIn = () => {
    navigate('SearchScreen');
  };
  return (
    <Pressable onPressIn={onPressIn} style={[styles.container, containerStyle]}>
      <AntDesign
        name="search1"
        size={22}
        color={colors.blue}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder={t('common.search_in_store')}
        value={searchInput}
        onChangeText={setSearchInput}
        editable={false}
        onPressIn={onPressIn}
      />
    </Pressable>
  );
};

export default SearchInput;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderRadius: spacing.small + 2,
    paddingHorizontal: spacing.medium,
  },
  searchIcon: {
    marginRight: spacing.small + 1,
  },
});
