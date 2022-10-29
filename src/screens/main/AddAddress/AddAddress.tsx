import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {BackButton, Button, InputField, Text} from 'components';
import {colors, spacing} from 'theme';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Switch} from 'react-native-paper';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const addressSchema = Yup.object().shape({
  firstName: Yup.string().required('first name is required'),
  lastName: Yup.string().required('last name is required'),
  address1: Yup.string().required('address 1 is required'),
  city: Yup.string().required('city is required'),
  email: Yup.string().email().required('email is required'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'phone number is not valid')
    .required('phone number is required'),
});

const AddAddress = () => {
  const {setOptions} = useNavigation();
  const [isDefualt, setDefualt] = useState<boolean>(false);
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
    });
  }, []);

  const initialVal = {
    companyName: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    phoneNumber: '',
    email: '',
    fax: '',
  };
  const onRegisterHandle = () => {};
  return (
    <View>
      <ScrollView
        style={{backgroundColor: colors.white}}
        contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}}>
        <Formik
          initialValues={initialVal}
          onSubmit={onRegisterHandle}
          validationSchema={addressSchema}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => {
            return (
              <>
                <Text
                  tx="addAddress.description"
                  variant="smallRegular"
                  style={{marginBottom: 20}}
                />
                <InputField
                  value={values.companyName}
                  onChangeText={handleChange('companyName')}
                  onBlur={handleBlur('companyName')}
                  containerStyle={styles.inputContainer}
                  placeholder={'addAddress.coName'}
                  error={errors.companyName}
                />
                <View style={[styles.rowFiled, styles.inputContainer]}>
                  <InputField
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    containerStyle={{flex: 1}}
                    placeholder={'addAddress.fName'}
                    error={errors.firstName}
                  />
                  <View style={{width: 10}} />
                  <InputField
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    containerStyle={{flex: 1}}
                    placeholder={'addAddress.lName'}
                    error={errors.lastName}
                  />
                </View>
                <InputField
                  value={values.address1}
                  onChangeText={handleChange('address1')}
                  onBlur={handleBlur('address1')}
                  placeholder={'addAddress.address1'}
                  error={errors.address1}
                />
                <InputField
                  value={values.address2}
                  onChangeText={handleChange('address2')}
                  onBlur={handleBlur('address2')}
                  placeholder={'addAddress.address2'}
                  error={errors.address2}
                />
                <InputField
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  placeholder={'addAddress.city'}
                  error={errors.city}
                />
                <InputField
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder={'addAddress.email'}
                  error={errors.email}
                />
                <InputField
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  placeholder={'addAddress.phone'}
                  error={errors.phoneNumber}
                />
                <InputField
                  value={values.fax}
                  onChangeText={handleChange('fax')}
                  onBlur={handleBlur('fax')}
                  placeholder={'addAddress.fax'}
                  error={errors.fax}
                />
                <View style={styles.defualtContainer}>
                  <Switch
                    value={isDefualt}
                    onValueChange={() => setDefualt(!isDefualt)}
                    color={colors.primary}
                  />
                  <Text
                    tx="addAddress.setDefualt"
                    variant="xSmallBold"
                    style={{marginHorizontal: 10}}
                  />
                </View>
                <Button
                  style={{marginBottom: 10}}
                  title="addAddress.submitBtn"
                />
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: colors.white,
    // justifyContent: 'space-between',
  },
  inputContainer: {
    // marginBottom: spacing.medium - 2,
  },
  rowFiled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defualtContainer: {
    backgroundColor: '#0232EB10',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    marginBottom: 15,
    marginTop: 20,
  },
});

export default AddAddress;
