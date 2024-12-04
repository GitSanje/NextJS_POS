
"use client"

import { InvoiceDataType } from "@/types";

const SalesInvoiceEmail  = ({ invoice}:{
    invoice: InvoiceDataType
}) => {
    const totalAmount = invoice?.carts.reduce((total, cart) => {
      return total + cart.amount;
    }, 0)?.toFixed(2);
  
    const totalTax = invoice?.carts.reduce((total, cart) => {
      return total + ((cart.product?.tax?.rate ?? 0) / 100) * cart.amount;
    }, 0)?.toFixed(2);
  
    return `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
        <div style="border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 20px;">
          <h2>Bill From:</h2>
          <p>Vendify Store</p>
          <p>150 Nayashor Street</p>
          <p>Nepal</p>
          <p>Vendifystore12@gmail.com</p>
        </div>
  
        <div style="border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 20px;">
          <h2>Bill To:</h2>
          <p>${invoice?.user?.name}</p>
          <p>${invoice?.streetAddress}, ${invoice?.city}, ${invoice?.state}</p>
          <p>${invoice?.user?.email}</p>
          <p>Invoice #: ${invoice?.InvoiceId}</p>
          <p>Invoice Date: ${new Date(invoice?.invoiceDate).toLocaleDateString()}</p>
          <p>Amount Due: $${totalAmount}</p>
        </div>
  
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f5f5f5; text-align: left;">
              <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Qty</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Unit Cost</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Discount</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tax</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice?.carts
              .map((cart) => {
                const productPrice = cart.product.salePrice;
                const discount =
                  (cart.product.discount ?? 0) / 100 * productPrice;
                const tax = cart.product.tax ? cart.product.tax.rate : 0;
                const finalPrice = productPrice - discount;
                const total = cart.quantity * finalPrice;
                const taxPrice = (tax / 100) * total;
                const lineTotal = (total + taxPrice).toFixed(2);
  
                return `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${cart.product.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${cart.variants.length > 0
                      ? cart.variants
                          .map((variant) => variant.option?.value)
                          .join(", ")
                      : "No variants"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${cart.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${productPrice.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${discount.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${taxPrice.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${lineTotal}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
  
        <div style="border-top: 1px solid #ccc; padding-top: 20px;">
          <h3>Summary</h3>
          <p>SubTotal: $${totalAmount}</p>
          <p>Tax: $${totalTax}</p>
          <p>Total: $${(
            parseFloat(totalAmount ?? "0") + parseFloat(totalTax ?? "0")
          ).toFixed(2)}</p>
        </div>
  
        <div style="text-align: center; padding-top: 20px;">
          <p>Thank you for your business!</p>
        </div>
      </div>
    `;
  };
  
  export default SalesInvoiceEmail;
  