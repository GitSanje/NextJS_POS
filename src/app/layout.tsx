import { Inter } from "next/font/google";

import { Metadata } from 'next';
import './styles/globals.css'
import Navbar from "../components/Navbar/Navbar";
import { GlobalProvider } from "../context/GlobalProvider";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";


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

      <body className={`${inter.className} bg-white`}>
      <Providers>
        <GlobalProvider>
     
          <Navbar/>
        {children}
       
        </GlobalProvider>
        </Providers>
        <ToastContainer/>
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