import React, {ReactNode, useMemo} from 'react';
import {View, StyleSheet, StatusBar, Pressable, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FilterIcon} from 'assets/icons';
import SearchInput from './components/SearchInput';
import BackButton from 'components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {SearchScreenNavigationProp} from 'navigators/NavigationsTypes';

const GO_BACK_SIZE = 36;
const ICON_SIZE = 20;

interface ISearchHeader {
  value: string;
  setValue: (value: string) => void;
  onSubmitEditing: () => void;
  autoFocus?: boolean;
  filterIcon?: boolean;
  Footer?: ReactNode;
  RightIcon?: any;
  placeholder?: string;
  facetsList?: any;
  route?: string;
  onPressRightIcon?: () => void;
}

const SearchHeader = ({
  setValue,
  value,
  onSubmitEditing,
  autoFocus = false,
  Footer,
  filterIcon = true,
  RightIcon,
  onPressRightIcon,
  placeholder = 'search.search-input',
  facetsList,
  route,
}: ISearchHeader) => {
  const {top} = useSafeAreaInsets();
  const {navigate} = useNavigation<SearchScreenNavigationProp>();
  const topSpace = useMemo(() => {
    return top;
  }, []);
  const onPressFilter = () => {
    navigate('FiltersScreen', {facetsList: facetsList, route});
  };
  return (
    <View
      style={{
        paddingTop: topSpace,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.smaller,
        paddingBottom: spacing.medium,
      }}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <BackButton route={route} />
        <SearchInput
          autoFocus={autoFocus}
          containerStyle={styles.inputField}
          placeholderTextColor={colors.white}
          placeholder={placeholder}
          textColor={colors.white}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={onSubmitEditing}
          search
          rightIcon={
            filterIcon && (
              <Pressable onPress={onPressFilter} style={styles.filterContainer}>
                <FilterIcon />
              </Pressable>
            )
          }
          leftIcon={
            <Pressable style={styles.searchIconContainer}>
              <AntDesign name="search1" size={ICON_SIZE} color={colors.white} />
            </Pressable>
          }
        />
        <Pressable onPress={onPressRightIcon} style={styles.RightIconContainer}>
          {RightIcon}
        </Pressable>
        {/* <Pressable style={styles.goBackContainer}>
          {RightIcon ? RightIcon : <CartIcon stroke={colors.white} />}
        </Pressable> */}
      </View>
      {Footer}
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexDirection: 'row',
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
  RightIconContainer: {
    backgroundColor: colors.white + 18,
    padding: spacing.small,
    borderRadius: spacing.small + 2,
  },
});
