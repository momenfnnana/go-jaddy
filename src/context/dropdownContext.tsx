import {createContext, useContext, useState, ChildContextProvider} from 'react';

interface IDropDownProvider {
  children: JSX.Element;
}
interface DropDownContext {
  isDropDownShown: boolean;
  setIsDropDownShown: (value: any) => void;
}
const DropDownContext = createContext<DropDownContext>({
  isDropDownShown: false,
  setIsDropDownShown: (value: any) => value,
});

const DropDownProvider = ({children}: IDropDownProvider) => {
  const [isDropDownShown, setIsDropDownShown] = useState<boolean>(false);

  return (
    <DropDownContext.Provider value={{isDropDownShown, setIsDropDownShown}}>
      {children}
    </DropDownContext.Provider>
  );
};

export {DropDownContext, DropDownProvider};

export const useDropDownContext = () => {
  return useContext(DropDownContext);
};
