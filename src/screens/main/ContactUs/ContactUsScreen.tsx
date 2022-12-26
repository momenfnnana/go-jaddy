import React from 'react';
import {Button, InputField, PhoneNumberInput} from 'components';
import {useFormik} from 'formik';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import {colors, spacing} from 'theme';
import {ContactUsHeader} from './components';
import {useSchema} from 'hook/useSchema';
import {useMutation} from '@tanstack/react-query';
import {postContactUs} from 'services/Profile';

interface IinitialValues {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Email: string;
  Message: string;
  countryCode: string;
}

const initialValues: IinitialValues = {
  FirstName: '',
  LastName: '',
  PhoneNumber: '',
  Email: '',
  Message: '',
  countryCode: '00970',
};
const ContactUsScreen = () => {
  const {contactUs} = useSchema();
  const {mutate, isLoading} = useMutation(postContactUs, {
    onSuccess: data => {
      return data;
    },
    onError: error => {
      return error;
    },
  });
  const {
    errors,
    handleSubmit,
    touched,
    values,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormik({
    onSubmit,
    validationSchema: contactUs,
    initialValues,
  });
  function onSubmit(values: IinitialValues) {
    mutate({
      ...values,
      PhoneNumber: values.countryCode + values.PhoneNumber,
      countryCode: undefined,
    });
  }
  const onChangeCountry = (value: string) => {
    setFieldValue('countryCode', value);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.container}>
        <ContactUsHeader />
        <View style={styles.contentContainer}>
          <InputField
            style={{}}
            placeholder="common.firstName"
            value={values.FirstName}
            onChangeText={handleChange('FirstName')}
            error={{
              value: errors.FirstName,
              touched,
            }}
          />
          <InputField
            style={{}}
            placeholder="common.lastName"
            value={values.LastName}
            onChangeText={handleChange('LastName')}
            error={{
              value: errors.LastName,
              touched,
            }}
          />
          <PhoneNumberInput
            style={{}}
            containerStyle={{}}
            value={values.PhoneNumber}
            onChangeText={handleChange('PhoneNumber')}
            onBlur={handleBlur('PhoneNumber')}
            onChangeCountry={onChangeCountry}
            error={{
              value: errors.PhoneNumber,
              touched,
            }}
          />
          <InputField
            style={{}}
            placeholder="profile.email"
            value={values.Email}
            onChangeText={handleChange('Email')}
            error={{
              value: errors.Email,
              touched,
            }}
          />
          <InputField
            style={styles.messageInput}
            placeholder="profile.your-message"
            multiline={true}
            numberOfLines={5}
            value={values.Message}
            onChangeText={handleChange('Message')}
            error={{
              value: errors.Message,
              touched,
            }}
          />
          <Button
            title="common.send"
            style={styles.submitButton}
            onPress={handleSubmit}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ContactUsScreen;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: spacing.medium,
    top: -spacing.normal,
  },
  messageInput: {
    height: 197,
  },
  submitButton: {
    marginTop: spacing.small,
  },
});
