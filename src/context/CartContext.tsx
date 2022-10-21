import {createContext, useState} from 'react';

interface ICartContext {
  productsNumber: number;
  setProductsNumber: (value: any) => void;
}
interface CartProvider {
  children: JSX.Element;
}
const CartContext = createContext<ICartContext>({
  productsNumber: 0,
  setProductsNumber: ({}) => {},
});

const CartProvider = ({children}: CartProvider) => {
  const [productsNumber, setProductsNumber] = useState<number>(0);

  return (
    <CartContext.Provider value={{productsNumber, setProductsNumber}}>
      {children}
    </CartContext.Provider>
  );
};

export {CartContext, CartProvider};
