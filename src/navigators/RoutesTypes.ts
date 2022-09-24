export type HomeRoutes = {
  Home: undefined;
  Profile: {userId: string};
};

export type AuthRoutes = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Splash: undefined;
};

export type MainNavigator = {
  HomeFlow: undefined;
  LoginFlow: {userId: string};
};
