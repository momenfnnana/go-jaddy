import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, StatusBar, Pressable, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing} from 'theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CartIcon, FilterIcon} from 'assets/icons';
import {SearchInput} from './components';
import ArrowIcon from 'components/Arrow';

const GO_BACK_SIZE = 36;
const ICON_SIZE = 20;

interface ISearchHeader {
  value: string;
  setValue: (value: string) => string;
  onSubmitEditing: () => {};
  autoFocus: boolean;
}

const SearchHeader = ({
  setValue,
  value,
  onSubmitEditing,
  autoFocus = false,
}: ISearchHeader) => {
  const {top} = useSafeAreaInsets();
  const {goBack} = useNavigation();
  return (
    <View style={[{paddingTop: top}, styles.container]}>
      <StatusBar barStyle="light-content" />
      <Pressable style={styles.goBackContainer} onPress={goBack}>
        <ArrowIcon />
      </Pressable>
      <SearchInput
        autoFocus={autoFocus}
        containerStyle={styles.inputField}
        placeholderTextColor={colors.white}
        placeholder={'search.search-input'}
        textColor={colors.white}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={onSubmitEditing}
        rightIcon={
          <Pressable style={styles.filterContainer}>
            <FilterIcon />
          </Pressable>
        }
        leftIcon={
          <Pressable style={styles.searchIconContainer}>
            <AntDesign name="search1" size={ICON_SIZE} color={colors.white} />
          </Pressable>
        }
      />
      <Pressable style={styles.goBackContainer}>
        <CartIcon stroke={colors.white} />
      </Pressable>
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    backgroundColor: colors.primary,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: spacing.smaller,
    paddingBottom: spacing.medium,
  },
  goBackContainer: {
    width: GO_BACK_SIZE,
    height: GO_BACK_SIZE,
    borderRadius: spacing.small + 2,
    backgroundColor: colors.white + 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconContainer: {
    width: GO_BACK_SIZE,
    height: GO_BACK_SIZE,
    borderRadius: spacing.small + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: colors.primary,
    width: GO_BACK_SIZE - 6,
    height: GO_BACK_SIZE - 6,
    borderRadius: spacing.small + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  inputField: {
    flex: 0.95,
    backgroundColor: colors.white + 18,
    borderWidth: 0,
    paddingVertical: spacing.none,
    height: Platform.OS === 'android' ? 36 : undefined,
    paddingHorizontal: spacing.tiny,
    alignSelf: 'flex-end',
  },
});
