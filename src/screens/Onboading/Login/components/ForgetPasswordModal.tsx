import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect} from 'react';
import {colors, spacing} from 'theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {Button, InputField, Text} from 'components';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthRoutes} from 'navigators/RoutesTypes';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {useMutation} from '@tanstack/react-query';
import {reset_password} from 'services/Auth';

interface IResetPasswordModalProps {
  style?: ViewStyle;
  visibleResetPasswordModal?: boolean;
  setvisibleResetPasswordModal?: (lang: boolean) => void;
  success?: (lang: boolean) => void;
}

interface IOnboardingNavigation extends NativeStackNavigationProp<AuthRoutes> {}
interface IinitialValues {
  email: string;
}
const ICON_WIDTH = 30;
const SIZE = 18;

const initialValues: IinitialValues = {
  email: '',
};
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('must be valid email address')
    .required('email is required'),
});
const ResetPasswordModal: React.FC<IResetPasswordModalProps> = ({
  visibleResetPasswordModal,
  setvisibleResetPasswordModal,
  success,
}) => {
  const {navigate} = useNavigation<IOnboardingNavigation>();
  const {t} = useTranslation();
  const onSubmitLogin = (values: any) => {
    const data = {
      Email: values.email,
    };
    mutate(data);
  };
  const {mutate, isLoading, isError, error, isSuccess, data} = useMutation(
    reset_password,
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        return error;
      },
    },
  );

  useEffect(() => {
    if (isSuccess) {
      success?.(true);
      setvisibleResetPasswordModal?.(false);
    }
  }, [isSuccess]);
  return (
    <>
      {visibleResetPasswordModal && (
        <View style={styles.container}>
          <Pressable
            style={styles.overlay}
            onPress={() => setvisibleResetPasswordModal!(false)}
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
                <Text tx="login.forget-password" variant="largeBold" />
                <Icon
                  onPress={() => setvisibleResetPasswordModal!(false)}
                  name="close"
                  size={26}
                  color={colors.gray[500]}
                />
              </View>
              <Text
                tx="login.forget-password-description"
                variant="smallRegular"
                color={colors.grayMain}
                center
                bottom="medium"
              />
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmitLogin}
                validationSchema={loginSchema}>
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                  <View>
                    <InputField
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder={t('common.email')}
                    />
                    {errors.email && (
                      <Text
                        variant="error"
                        color={colors.red}
                        style={styles.errorMessage}>
                        {errors.email}
                      </Text>
                    )}
                    {isError && (
                      <Text
                        variant="backend_error"
                        color={colors.red}
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 18,
                          marginTop: 20,
                        }}
                        tx={`${error?.response?.data?.Message}`}
                      />
                    )}
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

export default ResetPasswordModal;

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  introNumber: {
    maxWidth: ICON_WIDTH,
    minWidth: ICON_WIDTH,
  },
  flag: {
    width: SIZE,
    height: SIZE,
  },
  errorMessage: {
    marginHorizontal: spacing.large,
  },
});
