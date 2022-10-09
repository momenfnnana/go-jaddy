import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
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
  setValue: (value: string) => void;
  onSubmitEditing: () => void;
  autoFocus?: boolean;
  filterIcon?: boolean;
  Footer?: ReactNode;
  RightIcon?: any;
  placeholder?: string;
}

const SearchHeader = ({
  setValue,
  value,
  onSubmitEditing,
  autoFocus = false,
  Footer,
  filterIcon = true,
  RightIcon,
  placeholder = 'search.search-input',
}: ISearchHeader) => {
  const {top} = useSafeAreaInsets();
  const {goBack} = useNavigation();
  return (
    <View
      style={{
        paddingTop: top,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.smaller,
        paddingBottom: spacing.medium,
      }}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Pressable style={styles.goBackContainer} onPress={goBack}>
          <ArrowIcon size={ICON_SIZE} color={colors.white} />
        </Pressable>
        <SearchInput
          autoFocus={autoFocus}
          containerStyle={styles.inputField}
          placeholderTextColor={colors.white}
          placeholder={placeholder}
          textColor={colors.white}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={onSubmitEditing}
          rightIcon={
            filterIcon && (
              <Pressable style={styles.filterContainer}>
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
        <Pressable style={styles.goBackContainer}>
          {RightIcon ? RightIcon : <CartIcon stroke={colors.white} />}
        </Pressable>
      </View>
      {Footer}
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    // flex: 0.1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexDirection: 'row',
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
