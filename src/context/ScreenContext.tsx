import {createContext, useState} from 'react';

interface IScreenContext {
  screenName: string;
  setScreenName: (value?: any) => void;
}

interface IScreenProvider {
  children: JSX.Element;
}

const ScreenContext = createContext<IScreenContext>({
  screenName: '',
  setScreenName: () => {},
});

const ScreenProvider = ({children}: IScreenProvider) => {
  const [screenName, setScreenName] = useState<string>('');
  return (
    <ScreenContext.Provider value={{screenName, setScreenName}}>
      {children}
    </ScreenContext.Provider>
  );
};

export {ScreenContext, ScreenProvider};
