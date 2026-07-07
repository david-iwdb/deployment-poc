import { composeApp } from './compose';

const app = composeApp();
const port = Number(process.env.PORT ?? 3000);

const address = await app.listen({ port, host: '0.0.0.0' });
console.log(`server listening on ${address}`);
