import {
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {ISliderDataSource} from '../helpers/types';
import {Text} from 'components';

const SliderItem: React.FC<{
  style?: ViewStyle;
  item: ISliderDataSource;
}> = ({style, item}) => {
  const {width, height} = useWindowDimensions();
  const ImageSlide: React.Component = item.image;
  return (
    <View style={[styles.constainer, {width: width}, style]}>
      <View style={styles.containImage}>
        <ImageSlide />
      </View>
      <View style={{alignItems: 'center'}}>
        <Text tx={item.title} variant="largeBold" style={styles.title} center />
        <Text tx={item.subTitle} variant="largeBold" style={styles.subTitle} />
      </View>
    </View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
  constainer: {justifyContent: 'flex-end'},
  containImage: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    marginTop: 40,
    fontSize: 25,
  },
  subTitle: {
    marginTop: 10,
    color: '#FF6701',
    fontSize: 25,
  },
});
