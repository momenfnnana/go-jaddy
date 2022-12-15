import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {colors, spacing} from 'theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IshowListHandler} from 'screens/main/Search/Search';

const FILTER_ICON_SIZE = 26;

const ViewShow = ({
  showListHandler,
  viewType,
}: {
  viewType: string;
  showListHandler: (val: IshowListHandler) => void;
}) => {
  return (
    <View style={[styles.row, styles.viewFilters]}>
      <Pressable
        style={[
          styles.viewIconContainer,
          {
            backgroundColor: viewType === 'list' ? colors.secondary : undefined,
            marginRight: 10,
          },
        ]}
        onPress={() => showListHandler('list')}>
        <Feather
          name="list"
          size={18}
          color={viewType === 'list' ? colors.white : colors.grayMain}
        />
      </Pressable>
      <Pressable
        style={[
          styles.viewIconContainer,
          {
            backgroundColor: viewType === 'grid' ? colors.secondary : undefined,
          },
        ]}
        onPress={() => showListHandler('grid')}>
        <Ionicons
          name="grid-outline"
          size={18}
          color={viewType === 'grid' ? colors.white : colors.grayMain}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewFilters: {
    backgroundColor: colors.gray[1000],
    paddingVertical: spacing.tiny,
    paddingHorizontal: spacing.tiny,
    borderRadius: spacing.large,
    justifyContent: 'space-between',
  },
  viewIconContainer: {
    width: FILTER_ICON_SIZE,
    height: FILTER_ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: FILTER_ICON_SIZE * 0.5,
  },
});

export default ViewShow;
