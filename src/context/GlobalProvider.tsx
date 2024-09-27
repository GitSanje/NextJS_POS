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
import { arrayBufferToBase64, uint8ArrayToString } from "../lib/utils";

interface GlobalContextType {
    cartRef: RefObject<HTMLDivElement>;
    isCartOpen: boolean;
    cartToogle: (isCartOpen: boolean) => void
    setCartOpen: (isCartOpen: boolean) => void
    pdfRef: RefObject<HTMLDivElement>;
    refPdf: HTMLDivElement | null;
    setRefPdf: (refPdf: HTMLDivElement | null) => void;
    handleGeneratePdf: ( inputData: HTMLDivElement,toEmail: string, invoiceId:string, download: boolean ) =>  Promise<void>;

    order: {},
    setOrder: ( order: {} ) => void
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
  const [ order, setOrder ] = useState(null)
  
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
  const pdfRef = useRef(null);

 const handleGeneratePdf = async (inputData: HTMLDivElement | null, invoiceId:string, toEmail: string = "karkisanjay2002@gmail.com", download:boolean ) => {
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
              autoClose:200})
              return

          }
          
          toast.success(data.message,{
            autoClose:200})

         }) 
        
    }

  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};
  return (
    <>
      <globalContext.Provider value={{ cartRef, isCartOpen,cartToogle, setCartOpen,pdfRef,setRefPdf,refPdf ,handleGeneratePdf, order, setOrder}}>
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


