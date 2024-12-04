// import { emailQueue } from '@/lib/worker';
// import { createBullBoard } from '@bull-board/api';
// import { BullMQAdapter } from '@bull-board/api/BullMQAdapter';
// import { ExpressAdapter } from '@bull-board/express';
// import express from 'express';
// import { NextRequest } from 'next/server';

// // Create Bull Dashboard
// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/api/admin/queues');

// createBullBoard({
//   queues: [new BullMQAdapter(emailQueue)],
//   serverAdapter,
// });

// // Create and mount Express app
// const expressApp = express();
// expressApp.use('/api/admin/queues', serverAdapter.getRouter());

// // Next.js API Route Handler
// export const GET = async (req: NextRequest) => {
//   return new Promise<Response>((resolve) => {
//     expressApp(req as any, (req as any).rawResponse, () => {
//       resolve(
//         new Response(null, {
//           status: 200,
//         })
//       );
//     });
//   });
// };
