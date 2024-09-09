"use client";

import { useState, useEffect, useContext, FormEvent, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import khalti_icon from "../Assets/Khalti_Logo_Color.png";
import cash_icon from "../Assets/cash.png";
// import { ShopContext } from "../../Context/ShopContext";
// import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Image from "next/image";
import { useFormState } from "react-dom";
import { checkout } from "../../server-actions/checkout/checkout";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import CheckoutButton from "./CheckoutButton";

interface FormData {
  phoneNumber: string;
  state: string;
  email: string;
  name: string;
  streetaddress: string;
  zipcode: string;
  city: string;
  paymentMethod: string;
  totalAmount: string;
  cartData: string;
}


const stateOptions = [
  { value: "", label: "Choose State" },
  { value: "Bagmati", label: "Bagmati" },
  { value: "Madhesh", label: "Madhesh" },
  { value: "Gandaki", label: "Gandaki" },
  { value: "Lumbini", label: "Lumbini" },
  { value: "Karnali", label: "Karnali" },
  { value: "Sudurpaschim", label: "Sudurpaschim" },
];

const cityOptions = [
  { value: "", label: "Choose City" },
  { value: "Kathmandu", label: "Kathmandu" },
  { value: "Bhaktapur", label: "Bhaktapur" },
  { value: "Lalitpur", label: "Lalitpur" },
];

interface Props{
  session: Session | null
}

const CheckoutForm: React.FC<Props> = (props) => {
  // const {getTotalCartAmount, clearCart, cartItems} = useContext(ShopContext);
  const {  session } = props
  const [formData, setFormData] = useState<FormData>({
    phone:  session?.user?.phone || "",
    email: session?.user?.email || "",
    name:  session?.user?.name || "",
    streetaddress: "",
    zipcode: "",
    city: "",
    paymentMethod: "cash",
    state: "",
  });


  

   const [ state, action]= useFormState(checkout, undefined)


  
  
  const handleChange = (e: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

   
  };

  return (
    <div className=" d-flex justify-content-center align-items-center ">
      <div className="col-md-6">
        <h2 className="text-center mb-4">Delivery Address</h2>
        <form
        method="POST"
        action={action}>
          {/* <input
            type="hidden"
            id="totalAmount"
            name="totalAmount"
            value={formData.totalAmount}
          />
          <input
            type="hidden"
            id="cartData"
            name="cartData"
            value={formData.cartData}
          /> */}

          <div className="form-group">
            <label htmlFor="phoneNumber">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Street Address:</label>
            <input
              type="text"
              className="form-control"
              id="streetaddress"
              name="streetaddress"
              value={formData.streetaddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <select
              className="form-control"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              {stateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city">City:</label>
            <select
              className="form-control"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              {cityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <h3>Payment Method</h3>
            <div className="form-check">
              <input
                className="form-check-input  border-2 border-black"
                type="radio"
                name="paymentMethod"
                id="cash"
                value="cash"
                checked={formData.paymentMethod === "cash"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="cash">
                <Image
                  src="/cash.png"
                  alt="Cash"
                  width={80}
                  height={80}
                  style={{ marginRight: "10px" }}
                />{" "}
                Cash On Delivary
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input border-2 border-black"
                type="radio"
                name="paymentMethod"
                id="khalti"
                value="khalti"
                checked={formData.paymentMethod === "khalti"}
                onChange={handleChange}
              />
              <label
                className="form-check-label font-weight-bold"
                htmlFor="khalti"
              >
                <Image
                  src="/Khalti_Logo_Color.png"
                  alt="khalti"
                  width={120}
                  height={120}
                  style={{ marginRight: "10px" }}
                />
                Khalti
              </label>
            </div>
          </div>

          <CheckoutButton/>
            
          

        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
