import {createContext, useState} from 'react';

const CartContext = createContext({
  productsNumber: 0,
  setProductsNumber: value => value,
});

const CartProvider = ({children}) => {
  const [productsNumber, setProductsNumber] = useState(0);

  return (
    <CartContext.Provider value={{productsNumber, setProductsNumber}}>
      {children}
    </CartContext.Provider>
  );
};

export {CartContext, CartProvider};
