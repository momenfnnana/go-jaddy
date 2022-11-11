import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  ViewStyle,
  Pressable,
  Platform,
} from 'react-native';
import {colors, font, spacing} from 'theme';
import {t} from 'i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {HomeNavigationsType} from 'navigators/NavigationsTypes';
import {useLanguage} from 'hook/useLanguage';

interface ISearchInput {
  containerStyle: ViewStyle;
}
const SearchInput = ({containerStyle}: ISearchInput) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const {navigate} = useNavigation<HomeNavigationsType>();
  const {language} = useLanguage();
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
        style={[
          styles.input,
          {textAlign: language === '2' ? 'right' : 'left'},
        ]}
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
    paddingVertical: Platform.OS === 'ios' ? spacing.medium : spacing.tiny,
    borderRadius: spacing.small + 2,
    paddingHorizontal: spacing.medium,
  },
  searchIcon: {
    marginRight: spacing.small + 1,
  },
  input: {
    flex: 1,
    fontFamily: font.regular,
  },
});
