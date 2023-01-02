import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Formik} from 'formik';
import {
  addAddress,
  addBillingAddress,
  getCountries,
  getStatesByCountry,
} from 'services/Addresses';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {useSchema} from 'hook/useSchema';
import {colors, font, spacing} from 'theme';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputField, {PhoneNumberInput} from 'components/InputField';
import Loader from 'components/Loader';
import Text from 'components/Text';
import Button from 'components/Button';
import {Switch} from 'react-native-paper';
import {IAddress} from 'types';

interface IInitialValues {
  companyName: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  phoneNumber: string;
  email: string;
  fax: string;
}
const initialValues: IInitialValues = {
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

interface ISelectedState {
  item: any;
  isExistData: boolean;
  defualtText: string;
}

interface IAddAddressComponent {
  onSubmit: (address: IAddress) => void;
  isBillingAddress?: boolean;
}

const AddAddressComponent = ({
  onSubmit,
  isBillingAddress,
}: IAddAddressComponent) => {
  const {t} = useTranslation();
  const {addressSchema} = useSchema();
  const {mutate: mutateaddAddress, isLoading: isLoadingaddAddress} =
    useMutation(['addAddress'], addAddress);
  const {
    mutate: mutateAddBillingAddress,
    isLoading: isLoadingaddBillingAddress,
  } = useMutation(addBillingAddress, {
    onSuccess(data, variables) {
      onSubmit({
        ...variables,
        StateId: variables.StateId ? variables.StateId.toString() : undefined,
        CountryName: countrySelected.Text,
        Id: data.data.Properties?.NewAddressId,
      });
      return data;
    },
  });

  const {
    data: statesData,
    isLoading: isLoadingStates,
    mutate: mutateGetStates,
  } = useMutation(['getStates'], getStatesByCountry, {
    onError(error) {
      setStateSelected({
        ...stateSelected,
        isExistData: false,
        defualtText: (error as any)?.response?.data?.Message,
      });
      return error;
    },
    onSuccess: data => {
      console.log({data: data.data});
      setStateSelected({
        ...stateSelected,
        isExistData: true,
        defualtText:
          data.data.length > 0
            ? t('addAddress.states-def')
            : t('addAddress.no-state'),
      });
      return data;
    },
  });

  const {data: countriesData, isLoading: isLoadingCountries} = useQuery(
    ['getCountries'],
    getCountries,
    {
      onSuccess: data => {
        // mutateGetStates(item.Value);
        return data;
      },
    },
  );

  const [countrySelected, setCountrySelected] = useState<any>({});
  const [isDefualt, setDefualt] = useState<boolean>(false);
  const [stateSelected, setStateSelected] = useState<ISelectedState>({
    item: {},
    isExistData: false,
    defualtText: t('addAddress.states-select-country'),
  });

  const [countryCode, setCountryCode] = useState<string>('970');
  const onChangeCountry = (value: string) => {
    setCountryCode(value);
  };

  const onSubmitForm = (values: any) => {
    if (isBillingAddress === true) {
      mutateAddBillingAddress({
        Address1: values.address1,
        Address2: values.address2,
        City: values.city,
        Company: values.companyName,
        CountryId: countrySelected?.Value,
        Email: values.email,
        FaxNumber: values.fax,
        FirstName: values.firstName,
        LastName: values.lastName,
        PhoneNumber: countryCode + values.phoneNumber,
        PostalCode: 'PostalCode',
        StateId: stateSelected.item?.Value,
        IsDefault: isDefualt,
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
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmitForm}
      validationSchema={addressSchema}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => {
        return (
          <>
            <InputField
              value={values.companyName}
              onChangeText={handleChange('companyName')}
              onBlur={handleBlur('companyName')}
              placeholder={'addAddress.coName'}
              error={{
                touched: touched.companyName,
                value: errors.companyName,
              }}
            />
            <View style={styles.rowFiled}>
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
                    name={'keyboard-arrow-down'}
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
                      color={
                        selectedItem?.Text || countrySelected.Text
                          ? undefined
                          : colors.gray[400]
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
                    name={'keyboard-arrow-down'}
                    size={18}
                    color={colors.black}
                  />
                )}
                disabled={
                  isLoadingStates ||
                  !stateSelected.isExistData ||
                  statesData?.data?.length == 0
                }
                renderCustomizedButtonChild={selectedItem =>
                  isLoadingStates ? (
                    <Loader size={'small'} />
                  ) : (
                    <Text
                      center
                      text={selectedItem?.Text || stateSelected.defualtText}
                      color={
                        selectedItem?.Text
                          ? undefined
                          : statesData?.data?.length == 0
                          ? colors.gray[400]
                          : undefined
                      }
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
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder={'addAddress.email'}
              error={{
                touched: touched.email,
                value: errors.email,
              }}
            />
            <PhoneNumberInput
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              errorTouched={touched.phoneNumber}
              errorValue={errors.phoneNumber}
              onChangeCountry={onChangeCountry}
              style={{}}
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
              isLoading={isLoadingaddAddress || isLoadingaddBillingAddress}
              onPress={handleSubmit}
              style={{marginBottom: 10}}
              title="addAddress.submitBtn"
            />
          </>
        );
      }}
    </Formik>
  );
};

export default AddAddressComponent;

const styles = StyleSheet.create({
  rowFiled: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  defualtContainer: {
    backgroundColor: colors.blue + 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    marginBottom: 15,
    marginTop: 20,
  },
});
