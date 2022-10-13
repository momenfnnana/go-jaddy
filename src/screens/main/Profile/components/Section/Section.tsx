import {Text} from 'components';
import React from 'react';
import {StyleSheet} from 'react-native';
import { spacing } from 'theme';
import {ITab} from '../../Lists/UnAuthList';
import Tab from '../Tab';
interface ISection {
  title: string;
  list: ITab[];
}
const Section = ({title, list}: ISection) => {
  return (
    <>
      <Text
        tx={title}
        variant="mediumBold"
        style={styles.profileTitle}
      />
      {list.map(item => {
        return <Tab key={item.id} {...item} />;
      })}
    </>
  );
};

export default Section;
const styles = StyleSheet.create({
  profileTitle: {
    marginTop: spacing.xLarge,
    marginBottom: spacing.xLarge,
  },
});
