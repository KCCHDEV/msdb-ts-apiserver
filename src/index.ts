import Fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import initializeDatabase from './msdb';

const fastify = Fastify({ logger: true });
const API_KEY = "NayGolf125125";

fastify.register(fastifyMultipart);
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  keyGenerator: (req: any) => req.headers['x-api-key'] + ':' + (req.headers['x-real-ip'] || req.ip)
});

// Middleware to verify API key
fastify.addHook('preHandler', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    reply.code(401).send({ error: 'Invalid API key' });
  }
});

// Routes
fastify.post('/:database/:table/add', async (request, reply) => {
  const { database, table } = request.params as { database: string, table: string };
  const data = await request.file();
  if (!data) {
    reply.code(400).send({ error: 'No file uploaded' });
    return;
  }

  const db = initializeDatabase(database)(table);
  
  if (!data.fields.data) {
    reply.code(400).send({ error: 'Missing data field' });
    return;
  }

  const dataField = data.fields.data;
  if (!('value' in dataField)) {
    reply.code(400).send({ error: 'Invalid data field format' });
    return;
  }

  const parsedData = JSON.parse(dataField.value as string);
  const id = data.fields.id && 'value' in data.fields.id ? data.fields.id.value as string : crypto.randomUUID();
  
  db.save(id, parsedData);
  return { success: true };
});

fastify.get('/:database/:table/find/:id', async (request) => {
  const { database, table, id } = request.params as { database: string, table: string, id: string };
  return initializeDatabase(database)(table).find(id);
});

fastify.get('/:database/:table/all', async (request) => {
  const { database, table } = request.params as { database: string, table: string };
  const orderBy = (request.query as any).orderBy || 'asc';
  return initializeDatabase(database)(table).getAll(orderBy);
});

fastify.get('/:database/:table/random', async (request) => {
  const { database, table } = request.params as { database: string, table: string };
  return initializeDatabase(database)(table).random();
});

fastify.post('/:database/:table/where', async (request) => {
  const { database, table } = request.params as { database: string, table: string };
  const condition = request.body as Record<string, any>;
  return initializeDatabase(database)(table).getWhere(condition);
});

fastify.delete('/:database/:table/:id', async (request) => {
  const { database, table, id } = request.params as { database: string, table: string, id: string };
  initializeDatabase(database)(table).remove(id);
  return { success: true };
});

fastify.listen({ port: 4589 });
