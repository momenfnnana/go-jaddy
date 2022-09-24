const white = '#FFFFFF';
const black = '#000000';
const tabsColor = '#121212';
const reloadColor = '#DEDEDE';
const grayMain = '#C4C4C4';
const grayMainBolder = '#C8C8C8';

const primaryPalette = {
  primary: '#FF914D', // Main
  primaryLight1: '#FF8863',
  primaryLight2: '#FFC19E',
  primaryLight3: '#F2DE91',
  primaryBackground: '#FFE6D6',
};

const secondaryPalette = {
  secondary: '#02323D', // Main
  secondaryLight1: '#17505C',
  secondaryLight2: '#A4C1C8',
  secondaryLight3: '#D1E0E3',
  secondaryBackground: '#EDF3F4',
};

const redPalette = {
  red: '#EF4444', // Main
  redLight: '#FEE2E2',
  redDark: '#B91C1C',
};
const yellowPalette = {
  yellow: '#F2A60D', // Main
  yellowLight: '#FDF7EB',
  yellowDark: '#C2850A',
};

const orangePalette = {
  orange: '#FF6701',
  orangeDark: '#F83838',
};

const greenPalette = {
  green: '#087F23', // Main
  greenLight: '#E7F3E7',
  greenSimiLight: '#B5B5B5',
  greenDark: '#005005',
};
const bluePalette = {
  blue: '#0232EB', // Main
  blueLight: '#E9F4FF',
  blueDark: '#005CB2',
};

const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

const statusPalette = {
  danger: redPalette.red,
  success: greenPalette.green,
  warning: yellowPalette.yellow,
  info: bluePalette.blue,
};
export type ColorStatus = keyof typeof statusPalette;

export const colors = {
  white,
  transparentWhite: 'rgba(255, 255, 255, 0.2)',
  transparent: 'rgba(0, 0, 0, 0)',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  ...primaryPalette,
  ...secondaryPalette,
  gray,
  ...redPalette,
  ...greenPalette,
  ...yellowPalette,
  ...bluePalette,
  ...orangePalette,

  text: gray[800], // Default text color
  input: gray[800], // Input text color
  border: gray[200], // Default border color
  background: white, // Screen background color
  disabledText: gray[500], // Disabled button background color
  disabledBackground: gray[200], // Disabled button background color

  // Status colors
  ...statusPalette,
  tabsColor,
  reloadColor,
  black,
  grayMain,
  grayMainBolder,
};

export type ColorsTypes = keyof typeof colors;
