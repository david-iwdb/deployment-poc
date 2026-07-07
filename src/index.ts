import { createApp } from './api/server';

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

const address = await app.listen({ port, host: '0.0.0.0' });
console.log(`server listening on ${address}`);
