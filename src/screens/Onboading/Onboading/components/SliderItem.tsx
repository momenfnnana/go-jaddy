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
  const ImageSlide = item.image;
  return (
    <View style={[{width: width, justifyContent: 'flex-end'}, style]}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <ImageSlide />
        {/* <Image style={{width: 280, height: 230}} source={item.image} /> */}
      </View>
      <View style={{alignItems: 'center'}}>
        <Text
          tx={item.title}
          variant="largeBold"
          style={{
            marginTop: 40,
            fontSize: 25,
          }}
          center
        />
        <Text
          tx={item.subTitle}
          variant="largeBold"
          style={{
            marginTop: 10,
            color: '#FF6701',
            fontSize: 25,
          }}
        />
      </View>
    </View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({});
