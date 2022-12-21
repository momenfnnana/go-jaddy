import {UserContext} from 'context/UserContext';
import {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import merge from 'utils/MergeSchema';
import {
  lowerCaseRegex,
  phoneRegExp,
  specialCharactersRegex,
  upperCaseRegex,
} from 'utils/Regex';
import * as Yup from 'yup';

export const useSchema = () => {
  const {t} = useTranslation();
  const {settings} = useContext(UserContext);

  const passwordValidation = Yup.string()
    .required(t('validation.password'))
    .min(
      settings.CustomerSettings?.PasswordMinLength,
      t('validation.password-min', {
        number: settings.CustomerSettings?.PasswordMinLength,
      }),
    )
    .matches(lowerCaseRegex, t('validation.password-lowercase'))
    .matches(upperCaseRegex, t('validation.password-uppercase'))
    .matches(specialCharactersRegex, t('validation.password-special'));

  const confirmValidation = (ref = 'password') =>
    Yup.string()
      .required(t('validation.confirmPassword'))
      .oneOf(
        [Yup.ref('password'), null],
        t('validation.confirmPassword-match'),
      );

  const defualtSchema = Yup.object().shape({
    firstName: Yup.string().required(t('validation.firstName')),
    lastName: Yup.string().required(t('validation.lastName')),
    email: Yup.string()
      .email(t('validation.email-template'))
      .required(t('validation.email')),
    phoneNumber: Yup.string()
      .length(9, t('validation.phoneNumber-length', {length: 9}))
      .matches(phoneRegExp, t('validation.phoneNumber-template'))
      .required(t('validation.phoneNumber')),
  });

  const contactUs = Yup.object().shape({
    FirstName: Yup.string().required(t('validation.firstName')),
    LastName: Yup.string().required(t('validation.lastName')),
    PhoneNumber: Yup.string()
      .length(9, t('validation.phoneNumber-length', {length: 9}))
      .matches(phoneRegExp, t('validation.phoneNumber-template'))
      .required(t('validation.phoneNumber-template')),
    Email: Yup.string()
      .email(t('validation.email-template'))
      .required(t('validation.email')),
    Message: Yup.string().required(t('validation.message')),
    countryCode: Yup.string(),
  });

  const addressRSchema = Yup.object().shape({
    address1: Yup.string().required(t('validation.address', {number: 1})),
    city: Yup.string().required(t('validation.city')),
  });

  const registerRSchema = Yup.object().shape({
    password: passwordValidation,
    confirmPassword: confirmValidation(),
  });

  const loginSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required(t('validation.phoneNumber'))
      .length(9, t('validation.phoneNumber-length', {length: 9})),
    password: Yup.string().required(t('validation.password')),
  });

  const updatePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t('validation.password')),
    newPassword: passwordValidation,
    confirmPassword: confirmValidation('newPassword'),
  });

  const addressSchema = merge(defualtSchema, addressRSchema);

  const registerSchema = merge(defualtSchema, registerRSchema);

  return {
    addressSchema,
    registerSchema,
    loginSchema,
    updatePasswordSchema,
    defualtSchema,
    contactUs,
  };
};
