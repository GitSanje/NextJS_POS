import { Worker, Queue, Job } from 'bullmq';
import Redis from 'ioredis';
import 'dotenv/config';

import { sendInvoiceEmailWithBody } from './mail';
import { postInvoice,getInvoice } from '@/server-actions/order/order';
const redisOptions = {
  host: 'localhost', 
  port: 6379,        
  maxRetriesPerRequest: null, 
};

const connection = new Redis(redisOptions);
interface EmailJobData {
    invoiceInfo: {
      orderId: string;
      amount: number;
    };
}

const queueName = "emailQueue";
export const emailQueue = new Queue(queueName, {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});


export const addDatatoEmailQueue = async (data: {
  orderId: string;
  amount: number;
}) => {
  try {
    await emailQueue.add("send-email", {
      invoiceInfo: data,
    });
    console.log(`Job added to queue for Order ID: ${data.orderId}`);
  } catch (error) {
    return null;
  }
};

console.log('====================================');
console.log(process.env.RUN_WORKER);
console.log('====================================');
if (process.env.RUN_WORKER === 'true') {
  
const worker = new Worker<EmailJobData>(
  queueName,

  async (job: Job<EmailJobData>) => {
    try {
      console.log(`Processing job ID: ${job.id} with data:`, job.data);

      const { orderId, amount } = job.data.invoiceInfo;

      const postResponse = await postInvoice(orderId, amount);
      if (!postResponse) {
        throw new Error(`Failed to post invoice for Order ID: ${orderId}`);
      }
      const invoiceData = await getInvoice(orderId);
      if (!invoiceData) {
        throw new Error(`Failed to retrieve invoice for Order ID: ${orderId}`);
      }

      await sendInvoiceEmailWithBody(invoiceData.user.email!,invoiceData);

      console.log('====================================');
      console.log(orderId, amount );
      console.log('====================================');

      await job.updateProgress(100);
    } catch (error) {
      console.error(`Error processing job ID: ${job.id}`, error);
      throw error;
    }
  },
  {
      connection,
      // concurrency: 5,
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err}`);
});



}
  
