import DatabaseClient from './client';

const apiKey = '222'; // Replace with your API key
const baseUrl = 'http://localhost:3000'; // Replace with your server base URL

const client = new DatabaseClient(apiKey, baseUrl);

// Set API key later if needed
// client.setApiKey('new-api-key');

// Example usage
const databaseName = 'makishop';
const tableName = 'user';

client.addItem(databaseName, tableName, { id: '1', db: { value: 'example' }, }, "user");
