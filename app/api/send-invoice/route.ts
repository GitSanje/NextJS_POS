import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { sendInvoiceEmail } from '@/lib/mail';

export async function POST(request: Request) {
    const { toEmail, invoiceId, pdfBuffer } = await request.json();
    console.log(toEmail, invoiceId, pdfBuffer);
    

   try {
    
     
     await sendInvoiceEmail( toEmail, invoiceId, pdfBuffer)
     return NextResponse.json({ success: true });
 
   } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Error sending email' }, { status: 500 });
   }

}