"use client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, {
  ReactNode,
  useState,
  createContext,
  useRef,
  useEffect,
  RefObject,
  useContext,
} from "react";
import { sendInvoiceEmail } from "../lib/mail";
import { toast } from "react-toastify";
import { arrayBufferToBase64 } from "../lib/utils";
import { useCartStore } from "../hooks/useCartStore";
import { useSession } from "next-auth/react";
import { InvoiceType } from "../types";
import { Session } from "next-auth/core/types";
import { getUserSession } from "../server-actions/user";
import { CartItem } from "@/types/orderType";



interface GlobalContextType {
    cartRef: RefObject<HTMLDivElement | null>;
    isCartOpen: boolean;
    cartToogle: (isCartOpen: boolean) => void
    setCartOpen: (isCartOpen: boolean) => void
   
    refPdf: HTMLDivElement | null;
    setRefPdf: (refPdf: HTMLDivElement | null) => void;
    pdfRef:  RefObject<HTMLDivElement | null>;
    handleGeneratePdf: ( inputData: HTMLDivElement, invoiceId:string, download: boolean,toEmail?: string ) =>  Promise<void>;
    cartInfo: { subTotal: number, totaltax: number};
    order: InvoiceType | null;
    setOrder: ( order: InvoiceType ) => void;
    userId: string| undefined;
    orderSummary: {
       cart: Record<string, number>;
       setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>
       cartItems: CartItem[];
       setCartItems : (items: CartItem[] | ((prevItems: CartItem[]) => CartItem[])) => void;
    };
    cartFunctions: {
      removeFromCart: (productId: string | undefined) => void;
    addToCart: (productId: string | undefined) => void;

    }
    
    
}

const globalContext = createContext<GlobalContextType | null>(null);

interface Props {
  children: ReactNode;
}
export const GlobalProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const [refPdf, setRefPdf] = useState<HTMLDivElement | null>(null);
  
  const cartRef = useRef<HTMLDivElement>(null);
  const [ order, setOrder ] = useState<InvoiceType| null>(null)
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = (global?.window !== undefined) ? localStorage.getItem("cartItemsData"): null ;
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });


  const addToCart = (productId: string | undefined) => {
    if (!productId) {
      return;
    }
    setCart((prevCart) => {
      const prevCarts = { ...prevCart };
      const updatedCarts = {
        ...prevCarts,
        [productId]: (prevCarts[productId] || 0) + 1,
      };

      return updatedCarts;
    });
  };

  const removeFromCart = (productId: string | undefined) => {
    if (!productId) {
      return;
    }
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  


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
  const pdfRef = useRef<HTMLDivElement | null>(null);

 const handleGeneratePdf = async (inputData: HTMLDivElement | null, invoiceId:string,  download:boolean,toEmail?: string  ) => {
  // const inputData = pdfRef.current;
  try {
    if(!inputData){
      return 
    }
    const canvas = await html2canvas(inputData);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    const width = pdf.internal.pageSize.getHeight();
    const height = (canvas.height * width) / canvas.height;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    const buffer = pdf.output('arraybuffer')
  
    // const bufferStr = uint8ArrayToString(buffer)
    const bufferStr = arrayBufferToBase64(buffer);
    // console.log(bufferStr,buffer);
    if(download){
      pdf.save(`invoice-${invoiceId}.pdf`);
    }

    else{
        "use server"
        
         await sendInvoiceEmail(toEmail="santzukarki37@gmail.com",invoiceId,bufferStr ).then(data => {
          if(!data.success){
            toast.error(data.error.message,{
              autoClose:2000})
              return

          }
          
          toast.success(data.message,{
            autoClose:2000})

         }) 
        
    }

  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

const { subTotal,totaltax } = useCartStore();

useEffect(() => {
  const fetchUserId = async () => {
    const sessionId = await getUserSession(); // Call your session fetch function
    setUserId(sessionId); // Update userId in state
   
  };

  fetchUserId(); // Invoke the function
}, []);

console.log('====================================');
console.log(userId);
console.log('====================================');

 const cartInfo = {subTotal,totaltax }




  const [cart, setCart] = useState<Record<string, number>>(() => {
    const carts = (global?.window !== undefined )? localStorage.getItem("cartItems")  :  null;
    if (carts) {
      return JSON.parse(carts);
    } else {
      return {};
    }
  });
  useEffect(() => {
    if (cart) {

      if (global?.window !== undefined)  {
        localStorage.setItem("cartItems", JSON.stringify(cart));
      } 
      
    }
  }, [cart]);

   const orderSummary = {
    cart,
    setCart,
    cartItems,
    setCartItems
   }

   const cartFunctions = {
    addToCart,
    removeFromCart
   }

  return (
    <>
      <globalContext.Provider value={{ cartRef, isCartOpen,cartToogle, setCartOpen,setRefPdf,refPdf ,pdfRef,handleGeneratePdf, order, setOrder, cartInfo, userId,orderSummary,cartFunctions}}>
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


