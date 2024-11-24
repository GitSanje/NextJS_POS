// "use client"
// import React from "react";
// import {
//   Elements,
//   LinkAuthenticationElement,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import CheckoutForm from "./Checkout";
// import { Session } from "next-auth/core/types";
// import CheckoutPage2 from "./CheckoutPage2";

// type CheckoutFormProps = {
//   clientSecret: string;
//   session: Session;
  
// };

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
// );
// const PaymentForm: React.FC<CheckoutFormProps> = (props) => {
//   const { session, clientSecret } = props;
  
//   return (
//     <>
//       <Elements options={{ clientSecret }} stripe={stripePromise}>
//         <CheckoutPage2 session={session} />
//       </Elements>
//     </>
//   );
// };

// export default PaymentForm;
