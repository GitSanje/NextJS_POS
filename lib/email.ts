import { InvoiceDataType } from "@/types";
import logo from "@/public/invoice-logo.jpg";

export const createEmailBody = (Invoicedata: InvoiceDataType) => {
  const { user, carts, InvoiceId, invoiceDate, streetAddress, city } = Invoicedata;

  const formattedDate = new Date(invoiceDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalAmount = carts.reduce((total, cart) => total + cart.amount, 0).toFixed(2);
  const totalTax = carts.reduce((total, cart) => {
    return total + ((cart.product?.tax?.rate ?? 0) / 100) * cart.amount;
  }, 0)?.toFixed(2);

  const cartRows = carts
    .map((cart) => {
      const productPrice = cart.product.salePrice.toFixed(2);
      const discount = cart.product.discount
        ? (cart.product.discount / 100) * cart.product.salePrice
        : 0;
      const finalPrice = cart.product.salePrice - discount;
      const tax = cart.product.tax?.rate || 0;
      const total = finalPrice * cart.quantity;
      const taxAmount = (tax / 100) * total;
      const lineTotal = (total + taxAmount).toFixed(2);

      return `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; text-align: left;">${cart.product.name}</td>
          <td style="padding: 8px; text-align: left;">${
            cart.variants.length > 0
              ? cart.variants.map((v) => v.option?.value).join(", ")
              : "No variants"
          }</td>
          <td style="padding: 8px; text-align: center;">${cart.quantity}</td>
          <td style="padding: 8px; text-align: center;">$${productPrice}</td>
          <td style="padding: 8px; text-align: center;">$${discount.toFixed(2)}</td>
          <td style="padding: 8px; text-align: center;">$${taxAmount.toFixed(2)}</td>
          <td style="padding: 8px; text-align: center;">$${lineTotal}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6;">
      <h2 style="text-align: center; color: #444;">Sale Invoice</h2>
      <p><strong>Invoice ID:</strong> ${InvoiceId}</p>
      <p><strong>Invoice Date:</strong> ${formattedDate}</p>
      
      <h3>Bill From:</h3>
      <p>
        Vendify Store<br>
        150 Nayashor Street<br>
        Nepal<br>
        <a href="mailto:Vendifystore12@gmail.com" style="color: #0066cc;">Vendifystore12@gmail.com</a>
      </p>
      
      <h3>Bill To:</h3>
      <p>
        ${user.name}<br>
        ${streetAddress}, ${city}<br>
        <a href="mailto:${user.email}" style="color: #0066cc;">${user.email}</a>
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
        <thead>
          <tr style="background: #f4f4f4;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Description</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Unit Cost</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Discount</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Tax</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${cartRows}
        </tbody>
      </table>

      <div style="margin-top: 20px; font-size: 14px; color: #333;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <p>SubTotal:</p>
          <p style="color: #888;">$${totalAmount}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <p>Tax:</p>
          <p style="color: #888;">$${totalTax}</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <p>Total:</p>
          <p>$${(parseFloat(totalAmount ?? "0") + parseFloat(totalTax ?? "0")).toFixed(2)}</p>
        </div>
      </div>
      
      <h3 style="margin-top: 20px;">Notes</h3>
      <p>Free Shipping for 30 Days Money back guarantee</p>
      
      <footer style="text-align: center; margin-top: 30px;">
       
        <p style="font-size: 12px; color: #888;">© 2024 Vendify Store. All rights reserved.</p>
      </footer>
    </div>
  `;
};


 // <img
        //   src="${logo}"
        //   alt="Vendify Store Logo"
        //   style="width: 80px; height: auto; margin-bottom: 10px;"
        // />
  // const invoice: InvoiceDataType = {
   
  //     id: "INV123456",
  //     state: "Paid",
  //     orderDate: new Date("2024-11-25"),
  //     streetAddress: "123 Example Street",
  //     city: "Kathmandu",
  //     user: {
  //       email: "john.doe@example.com",
  //       name: "John Doe",
  //     },
  //     carts: [
  //       {
  //         quantity: 2,
  //         amount: 40.0,
  //         product: {
  //           name: "Product A",
  //           salePrice: 20.0,
  //           discount: 10,
  //           taxId: "TAX123",
  //           tax: {
  //             rate: 5,
  //           },
  //         },
  //         variants: [
  //           {
  //             discount: 5,
  //             salePrice: 15.0,
  //             variant: { name: "Size" },
  //             option: { value: "Medium" },
  //           },
  //         ],
  //       },
  //       {
  //         quantity: 1,
  //         amount: 50.0,
  //         product: {
  //           name: "Product B",
  //           salePrice: 50.0,
  //           discount: 0,
  //           taxId: "TAX124",
  //           tax: {
  //             rate: 10,
  //           },
  //         },
  //         variants: [],
  //       },
  //     ],
  //     InvoiceId: "INV123456",
  //     invoiceDate: new Date("2024-11-25"),
    
  // };
  
  // export const Invoicedata = {
  //   id: invoice.id,
  //   state: invoice.state,
  //   orderDate: invoice.orderDate,
  //   streetAddress: invoice.streetAddress,
  //   city: invoice.city,
  //   user: {
  //     email: invoice.user.email,
  //     name: invoice.user.name,
  //   },
  //   carts: invoice.carts.map((cart) => ({
  //     quantity: cart.quantity,
  //     amount: cart.amount ?? 0,
  //     product: {
  //       name: cart.product.name,
  //       salePrice: cart.product.salePrice ?? 0,
  //       discount: cart.product.discount ?? null,
  //       taxId: cart.product.taxId ?? null,
  //       tax: cart.product.tax,
  //     },
  //     variants: cart.variants.map((variant) => ({
  //       discount: variant.discount ?? null,
  //       salePrice: variant.salePrice,
  //       variant: variant.variant,
  //       option: variant.option,
  //     })),
  //   })),
  //   InvoiceId: invoice.InvoiceId,
  //   invoiceDate: invoice.invoiceDate,
  // };
  
  // console.log(Invoicedata);
  