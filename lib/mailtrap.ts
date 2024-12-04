import { InvoiceDataType } from "@/types";
import { createEmailBody } from "./email";

let client: any;

export const initMailtrap = async () => {
  if (typeof window === "undefined") {
    const { MailtrapClient } = await import("mailtrap");
    client = new MailtrapClient({
      token: process.env.MAILTRAP_API_TOKEN!,
    });
  }
};

export const sendInvoiceEmailMailTrap = async (toEmail: string, invoicedata: InvoiceDataType) => {
    if (typeof window !== "undefined") {
        console.error("sendWelcomeEmail should only be called on the server side");
        return;
      }

      if (!client) {
        await initMailtrap();
      }

      const sender = { name: "Vendify Store", email: "vendifystore12@gmail.com" };

      const emailBody = createEmailBody(invoicedata);

      try {
        await client.send({
          from: sender,
          to: [{ email: toEmail }],
          subject: `Your Invoice #${invoicedata.InvoiceId}`,
          html: emailBody,  
        });
        console.log("Invoice email sent successfully");
      } catch (error) {
        console.error("Failed to send invoice email:", error);
      }

}