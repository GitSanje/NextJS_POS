"use client";
import React, {
  ReactNode,
  useState,
  createContext,
  useRef,
  useEffect,
  RefObject,
  useContext,
} from "react";

interface GlobalContextType {
    cartRef: RefObject<HTMLDivElement>;
    isCartOpen: boolean;
    cartToogle: (isCartOpen: boolean) => void
    setCartOpen: (isCartOpen: boolean) => void
}

const globalContext = createContext<GlobalContextType | null>(null);

interface Props {
  children: ReactNode;
}
export const GlobalProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const cartRef = useRef<HTMLDivElement>(null);
 
  
  const cartToogle = () => setCartOpen(!isCartOpen)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(e.target as Node)
      ) {
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartRef]);


  return (
    <>
      <globalContext.Provider value={{ cartRef, isCartOpen,cartToogle, setCartOpen }}>
        {children}
      </globalContext.Provider>
    </>
  );
};

export default function useGloabalContext() {
  const context = useContext(globalContext);
  if (!context) {
    throw new Error("useGloabalContext must be used within a GlobalProvider");
  }
  return context;
}
