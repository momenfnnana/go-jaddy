import {Text} from 'components';
import React from 'react';
import {StyleSheet} from 'react-native';
import {spacing} from 'theme';
import {ITab} from '../../Lists/UnAuthList';
import Tab from '../Tab';
interface ISection {
  title?: string;
  list: ITab[];
}
const Section = ({title, list}: ISection) => {
  return (
    <>
      {title && (
        <Text tx={title} variant="mediumBold" style={styles.profileTitle} />
      )}
      {list.map((item, index) => {
        return (
          <Tab
            key={item.id}
            {...item}
            showDevider={list.length !== index + 1}
          />
        );
      })}
    </>
  );
};

export default Section;
const styles = StyleSheet.create({
  profileTitle: {
    marginTop: spacing.xLarge,
    marginBottom: spacing.xLarge,
    textAlign: 'left',
  },
});
