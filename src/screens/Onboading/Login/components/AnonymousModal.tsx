import React, {useContext, useState} from 'react';
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {colors, spacing} from 'theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {Button, InputField, PhoneNumberInput, Text} from 'components';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yub from 'yup';
import {useTranslation} from 'react-i18next';
import {AuthNavigationsType} from 'navigators/NavigationsTypes';
import {useMutation} from '@tanstack/react-query';
import {doLogin_Guset} from 'services/Auth';
import {UserContext} from 'context/UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAccessToken} from 'hook/useAccessToken';

interface IAnonymousModalProps {
  style?: ViewStyle;
  language?: string;
  visibleAnonymousModal?: boolean;
  setLanguage?: (lang: string) => void;
  setvisibleAnonymousModal?: (lang: boolean) => void;
}

interface IinitialValues {
  phoneNumber: string;
  userName: string;
}

const initialValues: IinitialValues = {
  phoneNumber: '',
  userName: '',
};

const AnonymousModal: React.FC<IAnonymousModalProps> = ({
  visibleAnonymousModal,
  setvisibleAnonymousModal,
}) => {
  const {navigate, dispatch} = useNavigation<AuthNavigationsType>();
  const {t} = useTranslation();
  const [countryCode, setCountryCode] = useState<string>('00970');
  const {setAccessToken, updateProducts, setUserData} = useContext(UserContext);
  const {mutate, isLoading} = useMutation(doLogin_Guset, {
    onSuccess: data => {
      successLogin(data);
      setUserData(data.data);
    },
  });
  const {reload} = useAccessToken();
  const successLogin = (data: any) => {
    const {AccessToken} = data.data;
    setAccessToken(AccessToken);
    axios.defaults.headers.common['AccessToken'] = `${AccessToken}`;
    AsyncStorage.setItem('accessToken', AccessToken);
    reload(AccessToken);
    dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'HomeFlow', params: {screen: 'HomeStack'}}],
      }),
    );
    return data;
  };
  const closeKeyboard = () => {
    Keyboard.dismiss();
  };
  const onSubmitLogin = (values: any) => {
    closeKeyboard();
    mutate({
      FullName: values.userName,
      PhoneNumber: countryCode + values.phoneNumber,
    });
  };

  const onChangeCountry = (val: string) => {
    setCountryCode(val);
  };

  const loginSchema = Yub.object().shape({
    phoneNumber: Yub.string()
      .required('phone number must be string')
      .length(9, t('validation.phoneNumber-length', {length: 9})),
    userName: Yub.string().required('user name is required'),
  });

  return (
    <>
      {visibleAnonymousModal && (
        <View style={styles.container}>
          <Pressable
            style={styles.overlay}
            onPress={() => setvisibleAnonymousModal!(false)}
          />
          <SafeAreaView style={{width: '100%', alignItems: 'center'}}>
            <View style={styles.containerModal}>
              <View style={styles.containerHeader}>
                <Icon
                  name="close"
                  style={{opacity: 0}}
                  size={26}
                  color={colors.gray[500]}
                />
                <Text tx="login.anonymous-login" variant="largeBold" />
                <Icon
                  onPress={() => setvisibleAnonymousModal!(false)}
                  name="close"
                  size={26}
                  color={colors.gray[500]}
                />
              </View>
              <Text
                tx="login.anonymous-login-description"
                variant="smallRegular"
                color={colors.grayMain}
                center
                bottom="medium"
              />
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmitLogin}
                validationSchema={loginSchema}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <InputField
                      value={values.userName}
                      onChangeText={handleChange('userName')}
                      onBlur={handleBlur('userName')}
                      placeholder={t('common.userName')}
                      style={{}}
                    />
                    {errors.userName && (
                      <Text
                        variant="error"
                        color={colors.red}
                        style={styles.errorMessage}>
                        {errors.userName}
                      </Text>
                    )}
                    <PhoneNumberInput
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      errorValue={errors.phoneNumber}
                      errorTouched={touched.phoneNumber}
                      onChangeCountry={onChangeCountry}
                      style={{}}
                      containerStyle={styles.inputContainerStyle}
                    />
                    <Button
                      onPress={handleSubmit}
                      title="buttons.continue"
                      style={{marginTop: 30}}
                      isLoading={isLoading}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

export default AnonymousModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0008',
  },
  containerModal: {
    width: '90%',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  activeButn: {
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    borderRadius: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  disabledButn: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titlesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerStyle: {
    marginVertical: spacing.medium,
  },
  errorMessage: {
    marginHorizontal: spacing.large,
  },
});
