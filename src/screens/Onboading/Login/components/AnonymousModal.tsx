import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {colors, spacing} from 'theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {Button, InputField, Text} from 'components';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthRoutes} from 'navigators/RoutesTypes';
import {Formik} from 'formik';
import * as Yub from 'yup';
import {useTranslation} from 'react-i18next';
import {PalestineFlag} from 'assets/images';

interface IAnonymousModalProps {
  style?: ViewStyle;
  language?: string;
  visibleAnonymousModal?: boolean;
  setLanguage?: (lang: string) => void;
  setvisibleAnonymousModal?: (lang: boolean) => void;
}

interface IOnboardingNavigation extends NativeStackNavigationProp<AuthRoutes> {}
interface IinitialValues {
  phoneNumber: string;
  userName: string;
}
interface IFlag {
  imageUrl: ReactNode;
  introructionNumber: string;
}
const ICON_WIDTH = 30;
const SIZE = 18;

const initialValues: IinitialValues = {
  phoneNumber: '',
  userName: '',
};
const loginSchema = Yub.object().shape({
  phoneNumber: Yub.number()
    .required('phone number must be string')
    .min(10, 'phone number must be at least 10 characters'),
  userName: Yub.string().required('user name is required'),
});
const AnonymousModal: React.FC<IAnonymousModalProps> = ({
  visibleAnonymousModal,
  setvisibleAnonymousModal,
}) => {
  const {navigate} = useNavigation<IOnboardingNavigation>();
  const {t} = useTranslation();
  const [selectedFlag, setSelectedFlag] = useState<IFlag>({
    imageUrl: PalestineFlag,
    introructionNumber: '970',
  });

  const onSubmitLogin = values => {};
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
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                  <View>
                    <InputField
                      value={values.userName}
                      onChangeText={handleChange('userName')}
                      onBlur={handleBlur('userName')}
                      placeholder={t('common.userName')}
                    />
                    {errors.userName && (
                      <Text
                        variant="error"
                        color={colors.red}
                        style={styles.errorMessage}>
                        {errors.userName}
                      </Text>
                    )}
                    <InputField
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      containerStyle={styles.inputContainerStyle}
                      rightIcon={
                        <Pressable style={styles.row}>
                          <View style={styles.introNumber}>
                            <Text
                              text={selectedFlag.introructionNumber}
                              variant="smallRegular"
                              color={colors.brouwnLight}
                            />
                          </View>
                          <Image
                            source={selectedFlag.imageUrl}
                            style={[styles.flag, styles.introNumber]}
                            resizeMode="contain"
                          />
                        </Pressable>
                      }
                    />
                    {errors.phoneNumber && (
                      <Text
                        variant="error"
                        color={colors.red}
                        style={styles.errorMessage}>
                        {errors.phoneNumber}
                      </Text>
                    )}
                    <Button
                      onPress={handleSubmit}
                      title="buttons.continue"
                      style={{marginTop: 30}}
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
