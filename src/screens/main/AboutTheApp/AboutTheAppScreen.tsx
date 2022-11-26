import React from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {TopicIcon} from 'assets/icons';
import {Loader, Text} from 'components';
import {getTopics} from 'services/Profile';
import {colors, spacing} from 'theme';
import {AboutTheAppHeader} from './components';
import {useNavigation} from '@react-navigation/native';
import {AboutTheAppNavigationProp} from 'navigators/NavigationsTypes';

interface ITopicItem {
  item: {
    Id: number;
    SystemName: string;
    Title: string;
  };
}

const RenderItem = ({item}: ITopicItem) => {
  const {navigate} = useNavigation<AboutTheAppNavigationProp>();
  return (
    <Pressable
      style={styles.topicItem}
      onPress={() => navigate('AboutTheAppDetails', {Id: item.Id})}>
      <TopicIcon style={{marginRight: spacing.small}} />
      <Text text={item.Title} variant="smallBold" color={colors.primary} />
    </Pressable>
  );
};

const AboutTheAppScreen = () => {
  const {data, isLoading} = useQuery(['getTopics'], getTopics);
  if (isLoading) {
    return <Loader isPageLoading />;
  }
  return (
    <View style={styles.container}>
      <AboutTheAppHeader />
      <FlatList
        data={data?.data?.Topics}
        keyExtractor={item => item.Id.toString()}
        renderItem={({item}: ITopicItem) => <RenderItem item={item} />}
        style={{padding: spacing.medium}}
        ItemSeparatorComponent={() => <View style={{height: spacing.medium}} />}
      />
    </View>
  );
};

export default AboutTheAppScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.smaller + 1,
    borderColor: colors.aboutTheAppBorder,
    paddingVertical: spacing.normal,
    paddingHorizontal: spacing.medium,
  },
});
