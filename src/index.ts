import Fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import initializeDatabase from './msdb';
import crypto from 'crypto';
import logger from './modules/logger';

const fastify = Fastify({ logger: false });
const API_KEY = "NayGolf125125";

// Keep track of database instances
const dbInstances: Record<string, any> = {};

// Helper function to get or create database instance
const getDatabase = (database: string, table: string) => {
  const key = `${database}:${table}`;
  if (!dbInstances[key]) {
    dbInstances[key] = initializeDatabase(database)(table);
    logger.info(`Created new database instance: ${key}`);
  }
  return dbInstances[key];
};

// Add request logging hook
fastify.addHook('preHandler', async (request) => {
  logger.request(
    request.method,
    request.url,
    request.params,
    request.body
  );
});

fastify.register(fastifyMultipart);
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  keyGenerator: (req: any) => req.headers['x-api-key'] + ':' + (req.headers['x-real-ip'] || req.ip)
});

fastify.addHook('preHandler', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    logger.error(`Invalid API key attempt: ${apiKey}`);
    reply.code(401).send({ error: 'Invalid API key' });
  }
});

fastify.post('/:database/:table/add', async (request) => {
  try {
    const { database, table } = request.params as { database: string, table: string };
    const { data, id } = request.body as { data: any, id?: string };
    
    const db = getDatabase(database, table);
    const itemId = id || crypto.randomUUID();
    
    // Add ID to the data object
    const itemData = { ...data, id: itemId };
    
    db.save(itemId, itemData);
    
    // Verify the save
    const savedItem = db.find(itemId);
    if (!savedItem) {
      throw new Error('Failed to save item');
    }
    
    logger.success(`Added item to ${database}/${table}`, { id: itemId, data: savedItem });
    return { success: true, id: itemId, data: savedItem };
  } catch (error) {
    logger.error(`Failed to add item to ${(request.params as any).database}/${(request.params as any).table}`, error);
    throw error;
  }
});

fastify.get('/:database/:table/find/:id', async (request) => {
  const { database, table, id } = request.params as { database: string, table: string, id: string };
  const db = getDatabase(database, table);
  const item = db.find(id);
  
  if (!item) {
    logger.error(`Item not found: ${database}/${table}/${id}`);
    return { success: false, error: 'Item not found' };
  }
  
  logger.success(`Found item: ${database}/${table}/${id}`, item);
  return { success: true, data: item };
});

fastify.get('/:database/:table/all', async (request) => {
  const { database, table } = request.params as { database: string, table: string };
  const orderBy = (request.query as any).orderBy || 'asc';
  const db = getDatabase(database, table);
  const items = db.getAll(orderBy);
  
  logger.success(`Retrieved all items from ${database}/${table}`, { count: items.length });
  return { success: true, data: items };
});

fastify.get('/:database/:table/random', async (request) => {
  const { database, table } = request.params as { database: string, table: string };
  const db = getDatabase(database, table);
  const item = db.random();
  return { success: true, data: item };
});

fastify.post('/:database/:table/where', async (request) => {
  const { database, table } = request.params as { database: string, table: string };
  const condition = request.body as Record<string, any>;
  const db = getDatabase(database, table);
  const items = db.getWhere(condition);
  
  logger.success(`Found items in ${database}/${table} matching condition`, { 
    condition, 
    count: items.length 
  });
  return { success: true, data: items };
});

fastify.delete('/:database/:table/:id', async (request) => {
  try {
    const { database, table, id } = request.params as { database: string, table: string, id: string };
    const db = getDatabase(database, table);
    
    db.remove(id);
    
    // Clear the instance to force reload
    const key = `${database}:${table}`;
    delete dbInstances[key];
    
    logger.success(`Removed item: ${database}/${table}/${id}`);
    return { success: true, message: 'Item removed successfully' };
  } catch (error) {
    logger.error(`Failed to remove item: ${(request.params as any).id}`, error);
    throw error;
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 4589, host: '0.0.0.0' });
    logger.success(`Server running on port 4589`);
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
