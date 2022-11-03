import {createContext, useState} from 'react';

interface IWishlistContext {
  isRefetch: boolean;
  setIsRefetch: (value: boolean) => void;
}
interface WishlistProvider {
  children: JSX.Element;
}
const WishlistContext = createContext<IWishlistContext>({
  isRefetch: false,
  setIsRefetch: () => {},
});

const WishlistProvider = ({children}: WishlistProvider) => {
  const [isRefetch, setIsRefetch] = useState<boolean>(false);

  return (
    <WishlistContext.Provider value={{isRefetch, setIsRefetch}}>
      {children}
    </WishlistContext.Provider>
  );
};

export {WishlistContext, WishlistProvider};
