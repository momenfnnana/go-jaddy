import i18next from 'i18next';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import 'yup-phone';
import {passwordRegex} from './Regex';

// To add numbers: (?=.*\d)

export const validateValues = async (schema, values) => {
  return await schema.validate(values, {abortEarly: false}).catch(error => {
    Toast.show({
      type: 'error',
      text1: i18next.t('validation.error'),
      text2: error.errors.join('\n'),
    });
  });
};

export const emailSchema = yup.string().email().required().label('Email');
const passwordSchema = yup
  .string()
  .required()
  .matches(
    passwordRegex,
    'Password must contain at least 8 characters in lower and uppercase and at least one special character',
  );

const phoneSchema = yup
  .object()
  .test('test-name', 'Phone Number is required', value => {
    if (!value) {
      return false;
    }
    const phone = `+${value.callingCode}${value.number}`;
    const schema = yup.string().phone('US').required();
    return schema.isValidSync(phone);
  });

const usernameSchema = yup
  .string()
  .required('Email/Phone is required')
  .test('test-name', 'Enter valid email or phone number', value => {
    const isValidPhone = yup.string().phone('US').required().isValidSync(value);
    const isValidEmail = emailSchema.isValidSync(value);
    if (!isValidEmail && !isValidPhone) {
      return false;
    }
    return true;
  });

// Email or Phone
const usernameFields = {
  isPhoneUsername: yup.boolean().required(),
  email: yup.string().when('isPhoneUsername', {
    is: isPhoneUsername => isPhoneUsername === false,
    then: emailSchema,
    otherwise: yup.string(),
  }),
  phone: yup.object().when('isPhoneUsername', {
    is: isPhoneUsername => isPhoneUsername === true,
    then: phoneSchema,
    otherwise: yup.object(),
  }),
};

export const signInSchema = yup.object().shape({
  ...usernameFields,
  password: passwordSchema,
});

export const signUpSchema = yup.object().shape({
  username: usernameSchema,
});

export const signUpSecondStepSchema = yup.object().shape({
  password: passwordSchema,
});

export const forgotPasswordSchema = yup.object().shape({
  username: usernameSchema,
});

export const changePasswordSchema = yup.object().shape({
  password: passwordSchema,
  code: yup.string().required().length(6),
});

export const verifyPinSchema = yup.object().shape({
  code: yup.string().required().length(6),
});

export const freelancerInfoSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
});

export const createAvailabilitySchema = yup.object().shape(
  {
    selectedProvider: yup
      .object()
      .typeError('You must select a provider')
      .required(),
    times: yup
      .array(
        yup
          .object()
          .shape({
            startTime: yup.date(),
            endTime: yup.date(),
          })
          .test(
            'start-before-end',
            'Start time must be before end time',
            value => {
              if (!value) {
                return false;
              }
              const startTime = new Date(value.startTime);
              const endTime = new Date(value.endTime);
              return startTime < endTime;
            },
          ),
      )
      .min(1)
      .transform(value => value.filter(Boolean)),
    repeats: yup.object().nullable(),
    salonSuiteId: yup
      .number()
      .nullable()
      .when(['isFreelancer', 'canTravel'], {
        is: (isFreelancer, canTravel) => isFreelancer && !canTravel,
        then: yup
          .number()
          .typeError(
            i18next.t('validation.please_specify_location_for_availability'),
          )
          .required(),
        otherwise: yup.number().nullable(),
      }),
    canTravel: yup
      .boolean()
      .nullable()
      .when(['isFreelancer', 'salonSuiteId'], {
        is: (isFreelancer, salonSuiteId) => isFreelancer && !salonSuiteId,
        then: yup
          .boolean()
          .typeError(
            i18next.t('validation.please_specify_location_for_availability'),
          )
          .required(),
        otherwise: yup.boolean().nullable(),
      })
      .typeError('You must select an option'),
  },
  ['canTravel', 'salonSuiteId'],
);
