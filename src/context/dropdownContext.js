import {createContext, useContext, useState} from 'react';

const DropDownContext = createContext({
  isDropDownShown: false,
  setIsDropDownShown: value => value,
});

const DropDownProvider = ({children}) => {
  const [isDropDownShown, setIsDropDownShown] = useState(false);

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
