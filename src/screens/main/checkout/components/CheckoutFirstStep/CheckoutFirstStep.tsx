import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  AddressItem,
  Button,
  InputField,
  Loader,
  Switch,
  Text,
} from 'components';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getCheckoutAddresses} from 'services/Checkout';
import {colors, font, spacing} from 'theme';
import {IAddress} from 'types';
import {Formik} from 'formik';
import {useSchema} from 'hook/useSchema';
import SelectDropdown from 'react-native-select-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {addAddress, getCountries, getStatesByCountry} from 'services/Addresses';
import {useTranslation} from 'react-i18next';
interface ICheckoutAddress {
  item: IAddress;
  index: number;
  onSelect: () => void;
}
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
interface ISelectedState {
  item: any;
  isExistData: boolean;
  defualtText: string;
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
const RenderItem = ({item, onSelect}: ICheckoutAddress) => {
  return (
    <AddressItem
      item={item}
      isSelectAddress={true}
      onPressAddress={onSelect}
      containerStyle={{backgroundColor: colors.blue + 10}}
    />
  );
};

const CheckoutFirstStep = () => {
  const {t} = useTranslation();
  const {addressSchema} = useSchema();
  const [stateSelected, setStateSelected] = useState<ISelectedState>({
    item: {},
    isExistData: false,
    defualtText: t('addAddress.states-select-country'),
  });
  const [countrySelected, setCountrySelected] = useState<any>({});
  const [isDefualt, setDefualt] = useState<boolean>(false);
  const {data, isLoading} = useQuery(
    ['getCheckoutAddresses'],
    getCheckoutAddresses,
  );
  const {
    data: statesData,
    isLoading: isLoadingStates,
    mutate: mutateGetStates,
  } = useMutation(['getStates'], getStatesByCountry, {
    onError(error, variables, context) {
      setStateSelected({
        ...stateSelected,
        isExistData: false,
        defualtText: (error as any)?.response?.data?.Message,
      });
      return error;
    },
    onSuccess: () => {
      setStateSelected({
        ...stateSelected,
        isExistData: true,
        defualtText: t('addAddress.states-def'),
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
  const {mutate: mutateaddAddress, isLoading: isLoadingaddAddress} =
    useMutation(['addAddress'], addAddress);
  const onSelectAddress = () => {
    // placeholder the address and do api call if needed
  };
  const onsubmit = () => {
    // go to next step
  };
  if (isLoading) {
    return <Loader containerStyle={styles.containerStyle} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.componentTitle}>
        <Text
          color={colors.primary}
          variant="mediumBold"
          tx="checkout.payment-address"
        />
        <Text
          color={colors.arrowColor}
          variant="smallRegular"
          tx="checkout.address-to-recieve-invoice"
        />
      </View>
      <FlatList
        data={data?.data?.Addresses}
        keyExtractor={item => item?.Id.toString()}
        renderItem={data => <RenderItem {...data} onSelect={onSelectAddress} />}
        style={styles.flatList}
        ListFooterComponent={
          <Formik
            initialValues={initialValues}
            onSubmit={values => {
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
                            text={
                              selectedItem?.Text || stateSelected.defualtText
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
                  <InputField
                    value={values.phoneNumber}
                    keyboardType="numeric"
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
                    isLoading={isLoadingaddAddress}
                    onPress={handleSubmit}
                    style={{marginBottom: 10}}
                    title="addAddress.submitBtn"
                  />
                </>
              );
            }}
          </Formik>
        }
      />
    </View>
  );
};

export default CheckoutFirstStep;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.small,
    marginTop: spacing.xLarge,
    flex: 1,
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatList: {
    marginTop: spacing.normal,
  },
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
