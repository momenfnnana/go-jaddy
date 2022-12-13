import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {AboutTheAppRouteProp} from 'navigators/NavigationsTypes';
import {useQuery} from '@tanstack/react-query';
import {Loader, Text} from 'components';
import {getTopicDetails} from 'services/Profile';
import {AboutTheAppHeader} from '../AboutTheApp/components';
import {WebView} from 'react-native-webview';
const AboutTheAppDetails = () => {
  const {params} = useRoute<AboutTheAppRouteProp>();
  const getDetails = () => getTopicDetails({id: params.Id});
  const {data, isLoading} = useQuery(
    [`getTopicDetails${params.Id}`],
    getDetails,
  );
  if (isLoading) {
    return <Loader isPageLoading />;
  }

  return (
    <View style={styles.container}>
      <AboutTheAppHeader title={data?.data?.Topic?.Title?.Value} />
      <WebView
        originWhitelist={['*']}
        source={{html:`<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${data?.data?.Topic?.Body?.Value}</body></html>`}}
      />
    </View>
  );
};

export default AboutTheAppDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
