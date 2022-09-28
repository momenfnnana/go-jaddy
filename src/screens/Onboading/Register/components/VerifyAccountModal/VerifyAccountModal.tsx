import {Button, InputField, Text} from 'components';
import React, {useState} from 'react';
import {View, StyleSheet, useWindowDimensions, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {colors, spacing} from 'theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {RetrivePasswordIcon, VisibilityEyeIcon} from 'assets/icons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import {ICON_WIDTH} from 'screens/Onboading/Login/Login';
import {useMutation} from '@tanstack/react-query';
import {postChangePassword} from 'services/Auth';

const initialValues = {
  code: '',
  password: '',
};

const retrivePasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('must be valid email address')
    .required('email is required'),
});
interface IVerifyAccountModal {
  isVisible: boolean;
  onBackdropPress: ({}) => {};
}
const VerifyAccountModal = ({
  isVisible,
  onBackdropPress,
}: IVerifyAccountModal) => {
  const {width} = useWindowDimensions();
  const {t} = useTranslation();
  const [isPasswordShow, setIsPasswordShown] = useState<boolean>(false);
  const onsubmit = (values: any) => {
    console.log({values});
    //pass values here
    // mutate()
  };

  const {mutate, isLoading, isError, error, isSuccess, data} = useMutation(
    postChangePassword,
    {
      onSuccess: data => {
        return data;
      },
      onError: error => {
        return error;
      },
    },
  );

  const showPassword = () => {
    setIsPasswordShown(currentValue => !currentValue);
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <View style={[styles.container, {width}]}>
        <View>
          <View style={styles.containerHeader}>
            <Icon
              name="close"
              style={{opacity: 0}}
              size={26}
              color={colors.gray[500]}
            />
            <Text tx="common.retrive-password" variant="largeBold" />
            <Icon
              onPress={onBackdropPress}
              name="close"
              size={26}
              color={colors.gray[500]}
            />
          </View>
          <RetrivePasswordIcon style={styles.retrivePasswordIcon} />
          <Text
            tx="common.retrive-password-description"
            variant="mediumRegular"
            color={colors.grayMain}
            center
            style={styles.description}
          />
          <Formik
            initialValues={initialValues}
            onSubmit={onsubmit}
            validationSchema={retrivePasswordSchema}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <>
                <InputField
                  value={values.code}
                  onChangeText={handleChange('code')}
                  onBlur={handleBlur('code')}
                  placeholder={t('common.code')}
                  error={errors.code}
                  containerStyle={styles.input}
                />
                <InputField
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder={t('common.password')}
                  secureTextEntry={!isPasswordShow}
                  rightIcon={
                    <Pressable style={styles.row} onPress={showPassword}>
                      <View style={styles.introNumber} />
                      <VisibilityEyeIcon style={styles.introNumber} />
                    </Pressable>
                  }
                  containerStyle={styles.inputContainer}
                />
                <View style={styles.buttonsContainer}>
                  <Button
                    onPress={handleSubmit}
                    title="buttons.continue"
                    style={styles.submitButtonContainer}
                    // isLoading={isLoading}
                  />
                  <Text
                    tx="common.something-went-wrong"
                    variant="smallRegular"
                    center
                  />
                  <Button
                    variant="Secondary"
                    onPress={handleSubmit}
                    title="buttons.continue"
                    style={styles.submitButtonContainer}
                    color={colors.secondary}
                    // isLoading={isLoading}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyAccountModal;

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xxLarge,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: spacing.none,
    alignSelf: 'center',
    height: 600,
    marginBottom: -spacing.large,
    borderTopRightRadius: spacing.small,
    borderTopLeftRadius: spacing.small,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  retrivePasswordIcon: {
    alignSelf: 'center',
  },
  description: {
    paddingHorizontal: spacing.medium,
  },
  input: {
    marginHorizontal: spacing.normal - 1,
    marginVertical: spacing.normal - 1,
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
  inputContainer: {
    marginHorizontal: spacing.normal - 1,
    marginVertical: spacing.normal - 1,
  },
  submitButtonContainer: {
    marginHorizontal: spacing.normal,
    marginVertical: 10,
  },
  buttonsContainer: {
    marginTop: 30,
  },
});
