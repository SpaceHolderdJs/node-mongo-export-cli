const { MongoClient } = require('mongodb');
require('dotenv').config();

async function getAllCollections(options) {
  
  const connectionUri = options.uri || process.env.MONGODB_URI;
  const database = options.db || process.env.MONGODB_DB || 'smartify-dev';
  
  if (!connectionUri) {
    throw new Error('MongoDB URI not provided. Use --uri option or set MONGODB_URI environment variable');
  }
  
  const client = await MongoClient.connect(connectionUri);
  const db = client.db(database);
  
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  await client.close();
  
  return collectionNames;
}

module.exports = {
  getAllCollections
};