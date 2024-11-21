import Script from 'next/script'
import { Inter } from "next/font/google";

import { Metadata } from 'next';
import './styles/globals.css'
import Navbar from "../components/Navbar/Navbar";
import { GlobalProvider } from "../context/GlobalProvider";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: {
    default:'Vendify | ',
    template:'Vendify | %s',
    },
  description: 'The official Vendify.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
         {/* <Script strategy='afterInteractive'>{`
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3553114,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
      </Script> */}

      <body className={`${inter.className} bg-white`}>
      <Providers>
        <GlobalProvider>
     
          <Navbar/>
        {children}
        <Toaster />
        <ToastContainer/>
        </GlobalProvider>
        </Providers>
       
      </body>
    </html>
  );
}


// import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
// import "./styles/globals.css";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body>
//           <header>
//             <SignedOut>
//               <SignInButton />
//             </SignedOut>
//             <SignedIn>
//               <UserButton />
//             </SignedIn>
//           </header>
//           <main>{children}</main>
//         </body>
//       </html>
//     </ClerkProvider>
//   )
// }