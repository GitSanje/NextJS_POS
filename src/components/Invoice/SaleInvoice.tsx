import Image from "next/image";
import React from "react";
import logo from "@/public/invoice-logo.jpg";
import PageHeader from "../PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
export default function SalesInvoice({ order}: {
  order: any[]
}) {
  return (
    <div className="max-w-4xl mx-auto border border-gray-500 p-8 rounded-sm ">
      
      {/* Header */}
      <div className="flex justify-between border-b border-gray-500 pb-8">
        <div className="flex flex-col">
          <h2>Bill From:</h2>
          <p>Vendify  Store</p>
          <p>150 Nayashor Street</p>
          <p>Nepal</p>
          <p>Vendifystore12@gmail.com</p>
        </div>
        <Image src={logo} alt="limifood logo" className="w-36 h-36" />
      </div>
      {/* Header End */}
      <div className="flex justify-between border-b border-gray-500 py-8">
        <div className="flex flex-col">
          <h2>Bill To:</h2>
          <p>Shoppify Hardware Store</p>
          <p>150 Eleign Street</p>
          <p>Canada</p>
          <p>shopiifystore@gmail.com</p>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <p>Invoice #</p>
            <p>0047</p>
          </div>
          <div className="flex justify-between">
            <p>Invoice Date</p>
            <p>January 20th 2024</p>
          </div>
          <div className="flex justify-between">
            <p>Amount Due</p>
            <p>$3000</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Item
              </th>
              <th scope="col" className="px-6 py-3">
                Item Description
              </th>
              <th scope="col" className="px-6 py-3">
                Qty
              </th>
              <th scope="col" className="px-6 py-3">
                Unit Cost
              </th>
              <th scope="col" className="px-6 py-3">
                Line Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Apple MacBook Pro 17"
              </th>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">2</td>
              <td className="px-6 py-4">$200</td>
              <td className="px-6 py-4">$400</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between border-b border-gray-500 py-8">
        <div className="flex flex-col">
          <h2>NOTES</h2>
          <p>Free Shipping for 30 Days Money back guarantee</p>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <p>SubTotal</p>
            <p>$3000</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>$20</p>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p>$3200</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pt-8">
        <Image src={logo} alt="limifood logo" className="w-20 h-20" />
      </div>
    </div>
  );
}