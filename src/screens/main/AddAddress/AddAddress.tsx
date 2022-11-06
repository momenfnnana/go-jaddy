import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BackButton, Button, InputField, Loader, Text} from 'components';
import {colors, font, spacing} from 'theme';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Switch} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  addAddress,
  editAddress,
  getCountries,
  getStatesByCountry,
} from 'services/Addresses';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import {
  AddAddressNavigationProp,
  PreviousAddressNavigationProp,
} from 'navigators/NavigationsTypes';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const addressSchema = Yup.object().shape({
  firstName: Yup.string().required('first name is required'),
  lastName: Yup.string().required('last name is required'),
  address1: Yup.string().required('address 1 is required'),
  city: Yup.string().required('city is required'),
  email: Yup.string().email().required('email is required'),
  phoneNumber: Yup.string()
    .length(15, 'must be 15 characters')
    .matches(phoneRegExp, 'phone number is not valid')
    .required('phone number is required'),
});

interface ISelectedState {
  item: any;
  isExistData: boolean;
  defualtText: string;
}

const AddAddress = () => {
  const {setOptions, navigate} = useNavigation<AddAddressNavigationProp>();
  const {params} = useRoute();
  const [isDefualt, setDefualt] = useState<boolean>(
    params?.item?.IsDefault || false,
  );
  const [countrySelected, setCountrySelected] = useState<any>({});
  const {t} = useTranslation();
  const [stateSelected, setStateSelected] = useState<ISelectedState>({
    item: {Value: (params as any)?.item?.StateId},
    isExistData: false,
    defualtText: t('addAddress.states-select-country'),
  });
  const {mutate: mutateaddAddress, isLoading: isLoadingaddAddress} =
    useMutation(['addAddress'], addAddress, {
      onSuccess: () => {
        navigate('PreviousTitles', {refetch: Math.random() * 1.6});
      },
    });
  const {mutate: mutateEditAddress, isLoading: isLoadingEditAddress} =
    useMutation(['editAddress'], editAddress, {
      onSuccess: () => {
        navigate('PreviousTitles', {refetch: Math.random() * 1.5});
      },
    });
  const {data: countriesData, isLoading: isLoadingCountries} = useQuery(
    ['getCountries'],
    getCountries,
    {
      onSuccess: data => {
        if ((params as any)?.item) {
          const item = data.data.find(
            (i: any) => i.Value == params?.item?.CountryId,
          );
          setCountrySelected(item);
          mutateGetStates(item.Value);
        }
      },
    },
  );
  const {
    data: statesData,
    isLoading: isLoadingStates,
    mutate: mutateGetStates,
  } = useMutation(['getStates'], getStatesByCountry, {
    onError(error, variables, context) {
      console.log('first: ', (error as any)?.response?.data?.Message);
      setStateSelected({
        ...stateSelected,
        isExistData: false,
        defualtText: (error as any)?.response?.data?.Message,
      });
    },
    onSuccess: () => {
      setStateSelected({
        ...stateSelected,
        isExistData: true,
        defualtText: t('addAddress.states-def'),
      });
    },
  });

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => <BackButton />,
    });
  }, []);

  const initialVal = {
    companyName: params?.item?.Company || '',
    firstName: params?.item?.FirstName || '',
    lastName: params?.item?.LastName || '',
    address1: params?.item?.Address1 || '',
    address2: params?.item?.Address2 || '',
    city: params?.item?.City || '',
    phoneNumber: params?.item?.PhoneNumber || '',
    email: params?.item?.Email || '',
    fax: params?.item?.FaxNumber || '',
  };

  const onRegisterHandle = () => {};

  return (
    <View>
      <ScrollView
        style={{backgroundColor: colors.white}}
        contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}}>
        <Formik
          initialValues={initialVal}
          onSubmit={values => {
            if (params?.item) {
              mutateEditAddress({
                Address1: values.address1,
                Address2: values.address2,
                City: values.city,
                Company: values.companyName,
                CountryId: countrySelected?.Value,
                Email: values.email,
                FaxNumber: values.fax,
                FirstName: values.firstName,
                LastName: values.lastName,
                PhoneNumber: values.phoneNumber,
                PostalCode: 'PostalCode',
                StateId: stateSelected.item?.Value,
                IsDefault: isDefualt,
                id: params?.item?.Id,
              });
            } else {
              mutateaddAddress({
                Address1: values.address1,
                Address2: values.address2,
                City: values.city,
                Company: values.companyName,
                CountryId: countrySelected?.Value,
                Email: values.email,
                FaxNumber: values.fax,
                FirstName: values.firstName,
                LastName: values.lastName,
                PhoneNumber: values.phoneNumber,
                PostalCode: 'PostalCode',
                StateId: stateSelected.item?.Value,
                IsDefault: isDefualt,
              });
            }
          }}
          validationSchema={addressSchema}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => {
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
                  error={{
                    touched: touched.companyName,
                    value: errors.companyName,
                  }}
                />
                <View style={[styles.rowFiled, styles.inputContainer]}>
                  <InputField
                    style={{flex: undefined, marginBottom: 15}}
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    containerStyle={{flex: 1}}
                    placeholder={'addAddress.fName'}
                    error={{
                      touched: touched.firstName,
                      value: errors.firstName,
                    }}
                  />
                  <View style={{width: 10}} />
                  <InputField
                    style={{flex: undefined, marginBottom: 15}}
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    containerStyle={{flex: 1}}
                    placeholder={'addAddress.lName'}
                    error={{
                      touched: touched.lastName,
                      value: errors.lastName,
                    }}
                  />
                </View>
                <InputField
                  value={values.address1}
                  onChangeText={handleChange('address1')}
                  onBlur={handleBlur('address1')}
                  placeholder={'addAddress.address1'}
                  error={{
                    touched: touched.address1,
                    value: errors.address1,
                  }}
                />
                <InputField
                  value={values.address2}
                  onChangeText={handleChange('address2')}
                  onBlur={handleBlur('address2')}
                  placeholder={'addAddress.address2'}
                  error={{
                    touched: touched.address2,
                    value: errors.address2,
                  }}
                />
                <View
                  style={{
                    marginBottom: spacing.small,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <SelectDropdown
                    search
                    searchInputStyle={{backgroundColor: colors.white}}
                    defaultButtonText={t('addAddress.countries-def')}
                    renderDropdownIcon={() => (
                      <MaterialIcons
                        name={`keyboard-arrow-down`}
                        size={18}
                        color={colors.black}
                      />
                    )}
                    disabled={isLoadingCountries}
                    renderCustomizedButtonChild={selectedItem =>
                      isLoadingCountries ? (
                        <Loader size={'small'} />
                      ) : (
                        <Text
                          center
                          text={
                            selectedItem?.Text ||
                            countrySelected.Text ||
                            t('addAddress.countries-def')
                          }
                        />
                      )
                    }
                    data={countriesData?.data || []}
                    buttonStyle={{
                      paddingVertical: spacing.small,
                      borderWidth: 1,
                      borderColor: colors.gray[400],
                      borderRadius: spacing.small,
                      backgroundColor: colors.white,
                      flex: 1,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      paddingHorizontal: spacing.smaller,
                    }}
                    buttonTextStyle={{fontFamily: font.regular}}
                    renderCustomizedRowChild={item => (
                      <View
                        style={{
                          backgroundColor: colors.white,
                          height: '100%',
                          justifyContent: 'center',
                          paddingHorizontal: spacing.smaller,
                        }}>
                        <Text variant="mediumBold" text={item.Text} />
                      </View>
                    )}
                    onSelect={item => {
                      setCountrySelected(item);
                      mutateGetStates(item.Value);
                    }}
                    buttonTextAfterSelection={selectedItem => {
                      return selectedItem.Text;
                    }}
                    rowTextForSelection={(item: any) => item}
                  />
                  <View style={{width: 10}} />
                  <SelectDropdown
                    defaultButtonText={t('addAddress.states-def')}
                    renderDropdownIcon={() => (
                      <MaterialIcons
                        name={`keyboard-arrow-down`}
                        size={18}
                        color={colors.black}
                      />
                    )}
                    disabled={isLoadingStates || !stateSelected.isExistData}
                    renderCustomizedButtonChild={selectedItem =>
                      isLoadingStates ? (
                        <Loader size={'small'} />
                      ) : (
                        <Text
                          center
                          text={selectedItem?.Text || stateSelected.defualtText}
                        />
                      )
                    }
                    data={statesData?.data || []}
                    buttonStyle={{
                      paddingVertical: spacing.small,
                      borderWidth: 1,
                      borderColor: colors.gray[400],
                      borderRadius: spacing.small,
                      backgroundColor: colors.white,
                      flex: 1,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      paddingHorizontal: spacing.smaller,
                    }}
                    buttonTextStyle={{fontFamily: font.regular}}
                    renderCustomizedRowChild={item => (
                      <View
                        style={{
                          height: '100%',
                          justifyContent: 'center',
                          paddingHorizontal: spacing.smaller,
                        }}>
                        <Text variant="mediumBold" text={item.Text} />
                      </View>
                    )}
                    onSelect={item => {
                      setStateSelected({...stateSelected, item: item});
                    }}
                    buttonTextAfterSelection={selectedItem => {
                      return selectedItem.Text;
                    }}
                    rowTextForSelection={(item: any) => item}
                  />
                </View>
                <InputField
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  placeholder={'addAddress.city'}
                  error={{
                    touched: touched.city,
                    value: errors.city,
                  }}
                />
                <InputField
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder={'addAddress.email'}
                  error={{
                    touched: touched.email,
                    value: errors.email,
                  }}
                />
                <InputField
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  placeholder={'addAddress.phone'}
                  error={{
                    touched: touched.phoneNumber,
                    value: errors.phoneNumber,
                  }}
                />
                <InputField
                  value={values.fax}
                  onChangeText={handleChange('fax')}
                  onBlur={handleBlur('fax')}
                  placeholder={'addAddress.fax'}
                  error={{
                    touched: touched.fax,
                    value: errors.fax,
                  }}
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
                  isLoading={isLoadingaddAddress || isLoadingEditAddress}
                  onPress={handleSubmit}
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
    // marginBottom: spacing.large,
  },
  rowFiled: {
    flexDirection: 'row',
    // alignItems: 'center',
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
