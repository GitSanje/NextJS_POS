"use server";
import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { welcomeTemplate } from "./template/welcome";
import { response } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import puppeteer from "puppeteer";
import jsdom from 'jsdom'
import { stringToUint8Array } from "./utils";


const generatePdf = async(htmlContent:string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });
  await browser.close();
  return  Buffer.from(pdfBuffer);;
}


function outerHTMLToElement(outerHTML :string) {
  const dom = new jsdom.JSDOM(outerHTML);
  return dom.window.document.body;
}

export async function sendInvoiceEmail(
  toEmail: string,
  invoiceId: string,
  fileContent: string
) {
  

  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  
    // const bufferEncode = stringToUint8Array(fileContent )
    const buffer = Buffer.from(fileContent,'base64');
   
    console.log(buffer,'send pdf');
    

  const mailOptions = {
    from: '"Vendify" <vendifyshop@gmail.com>',
    to: toEmail,
    subject: `Invoice #${invoiceId}`,
    text: "Please find attached the invoice for your recent order.",
    attachments: [
      {
        filename: `invoice-${invoiceId}.pdf`,
        content: buffer,
        contentType: "application/pdf",
      },
    ],
  };
  try {
    await transport.verify();
    await transport.sendMail(mailOptions);
    return response({
      success: true,
      code: 200,
      message: "successfully send invoice",
    });
  } catch (error) {
    console.error({ error });
    return response({
      success: false,
      error:{
        code:500,
        message:"failed to send invoice"

      }
    });
  }
}

// export function compileWelcomeTemplate(name: string, url: string) {
//   const template = handlebars.compile(welcomeTemplate);
//   const htmlBody = template({
//     name: name,
//     url: url,
//   });
//   return htmlBody;
// }

// export async function sendMail({
//   to,
//   name,
//   subject,
//   body,
// }: {
//   to: string;
//   name: string;
//   subject: string;
//   body: string;
// }) {
//   const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
//  console.log(SMTP_EMAIL, SMTP_PASSWORD);

//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: SMTP_EMAIL,
//       pass: SMTP_PASSWORD,
//     },
//   });
//   try {
//     const testResult = await transport.verify();
//     console.log(testResult);
//   } catch (error) {
//     console.error({ error });
//     return;
//   }

//   try {
//     const sendResult = await transport.sendMail({
//       from: SMTP_EMAIL,
//       to,
//       subject,
//       html: body,
//     });
//     console.log(sendResult);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export function compileWelcomeTemplate(name: string, url: string){
//   const template = handlebars.compile(welcomeTemplate);
//   const htmlBody = template({
//     name: name,
//     url: url,
//   });
//   return htmlBody;
// }
