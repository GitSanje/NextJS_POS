"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import logo from "@/public/invoice-logo.jpg";
import PageHeader from "../PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGloabalContext from "@/src/context/GlobalProvider";

import { InvoiceType } from "@/src/types";
import { formatOrderDate } from "@/src/lib/utils";
interface SalesInvoiceProps {
  invoice: InvoiceType;
  hidden: boolean;
}

const SalesInvoice: React.FC<SalesInvoiceProps> = ({
  invoice,
  hidden = false,
}) => {
  const totalamount = invoice.carts.reduce((total, cart) => {
    return total + cart.amount;
  }, 0);

  const totalTax = invoice.carts.reduce((sum, cart) => {
    const sizeVariant = cart.variants.find(
      (var_p) => var_p.variant.name === "Size"
    );

    const tax = sizeVariant
      ? sizeVariant.salePrice * 0.2
      : cart.product.salePrice * 0.2;
    return sum + tax;
  }, 0);

  const { setRefPdf, refPdf, handleGeneratePdf, pdfRef } = useGloabalContext();

  // useEffect(() => {
  //   if (pdfRef.current) {
  //     setRefPdf(pdfRef.current);
  //     console.log("====================================");
  //     console.log(invoice, "from sale invoice", pdfRef.current);
  //     console.log("====================================");
  //     handleGeneratePdf(pdfRef.current, invoice.InvoiceId,false);
  //   }
  // }, [pdfRef, setRefPdf]);

  return (
    <>
      <div
        className={`max-w-4xl  mx-auto flex justify-between pt-5 ${
          hidden ? "hidden" : ""
        } `}
      >
        <PageHeader> Sale Invoice</PageHeader>
        <Button
          type="button"
          onClick={() => {
            pdfRef.current
              ? handleGeneratePdf(pdfRef.current, invoice.id, true)
              : null;
          }}
          className="inline-flex items-center justify-center px-4 py-3 text-xs font-bold text-gray-900 transition-all duration-200 bg-gray-100 binvoice binvoice-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-200"
        >
          Download Invoice
        </Button>
      </div>

      <div
        className="max-w-4xl mx-auto binvoice binvoice-gray-500 p-8 rounded-sm "
        ref={pdfRef}
      >
        {/* Header */}
        <div className="flex justify-between binvoice-b binvoice-gray-500 pb-8">
          <div className="flex flex-col">
            <h2>Bill From:</h2>
            <p>Vendify Store</p>
            <p>150 Nayashor Street</p>
            <p>Nepal</p>
            <p>Vendifystore12@gmail.com</p>
          </div>
          <Image src={logo} alt="limifood logo" className="w-36 h-36" />
        </div>
        {/* Header End */}
        <div className="flex justify-between binvoice-b binvoice-gray-500 py-8">
          <div className="flex flex-col">
            <h2>Bill To:</h2>
            <p>{invoice?.user.name}</p>
            <p>{`${invoice.streetAddress}, ${invoice.city}, ${invoice.state}`}</p>
            {/* <p>Canada</p> */}
            <p>{invoice.user.email}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p>Invoice #</p>
              <p className="text-gray-500">{invoice.InvoiceId}</p>
            </div>
            <div className="flex justify-between">
              <p>Invoice Date: </p>
              <p className="text-gray-500">
                {formatOrderDate(invoice.invoiceDate)}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Amount Due:</p>
              <p className="text-gray-500">${totalamount}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto ">
          <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <TableHeader className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <TableRow>
                <TableHead className="px-6 py-3">Item</TableHead>
                <TableHead className="px-6 py-3">Item Description</TableHead>
                <TableHead className="px-6 py-3">Qty</TableHead>
                <TableHead className="px-6 py-3">Unit Cost</TableHead>
                <TableHead className="px-6 py-3">Discount</TableHead>
                <TableHead className="px-6 py-3">Tax</TableHead>
                <TableHead className="px-6 py-3">Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.carts.map((cart, index) => {
                const productPrice =
                  cart.variants.length > 0
                    ? cart.variants[0]?.salePrice || cart.product.salePrice
                    : cart.product.salePrice;
                const lineTotal = cart.quantity * productPrice;

                return (
                  <TableRow
                    key={index}
                    className="bg-white binvoice-b dark:bg-gray-800 dark:binvoice-gray-700"
                  >
                    <TableCell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {cart.product.name}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {cart.variants.length > 0
                        ? cart.variants
                            .map((variant) => variant.option?.value)
                            .join(", ")
                        : "No variants"}
                    </TableCell>
                    <TableCell className="px-6 py-4">{cart.quantity}</TableCell>
                    <TableCell className="px-6 py-4">
                      ${productPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      ${lineTotal.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-4">${0.2}</TableCell>
                    <TableCell className="px-6 py-4">
                      ${lineTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between binvoice-b binvoice-gray-500 py-8">
          <div className="flex flex-col">
            <h2>NOTES</h2>
            <p>Free Shipping for 30 Days Money back guarantee</p>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p>SubTotal: </p>
              <p className="text-gray-500">${totalamount}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax</p>
              <p>${totalTax}</p>
            </div>
            <div className="flex justify-between">
              <p>Total</p>
              <p>${totalamount - totalTax}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center pt-8">
          <Image src={logo} alt="limifood logo" className="w-20 h-20" />
        </div>
      </div>
    </>
  );
};

export default SalesInvoice;
