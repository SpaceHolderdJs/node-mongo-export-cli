const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const { getAllCollections } = require('./utils');
require('dotenv').config();

async function connectToMongo(uri, dbName) {
  // Use provided URI or fall back to environment variable
  const connectionUri = uri || process.env.MONGODB_URI;
  const database = dbName || process.env.MONGODB_DB || '';
  
  if (!connectionUri) {
    throw new Error('MongoDB URI not provided. Use --uri option or set MONGODB_URI environment variable');
  }
  
  const client = await MongoClient.connect(connectionUri);
  return { client, db: client.db(database) };
}

async function exportCollection(collectionName, options) {
  const spinner = ora(`Exporting collection: ${collectionName}`).start();
  
  try {
    const { client, db } = await connectToMongo(options.uri, options.db);
    
    // Create output directory if it doesn't exist
    const outputDir = options.output || './mongodb-export';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const collection = db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    
    const outputPath = path.join(outputDir, `${collectionName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2));
    
    await client.close();
    
    spinner.succeed(`Exported ${documents.length} documents from ${collectionName} to ${outputPath}`);
    return { collectionName, count: documents.length, path: outputPath };
  } catch (error) {
    spinner.fail(`Failed to export ${collectionName}`);
    throw error;
  }
}

async function exportAll(options) {
  const spinner = ora('Getting all collections').start();
  
  try {
    const { client, db } = await connectToMongo(options.uri, options.db);
    const collections = await getAllCollections({ uri: options.uri, db: options.db });
    
    spinner.succeed(`Found ${collections.length} collections`);
    
    const results = [];
    for (const collection of collections) {
      const result = await exportCollection(collection, options);
      results.push(result);
    }
    
    await client.close();
    
    console.log('\nExport summary:');
    results.forEach(result => {
      console.log(`- ${result.collectionName}: ${result.count} documents`);
    });
    
    return results;
  } catch (error) {
    spinner.fail('Failed to export all collections');
    throw error;
  }
}

module.exports = {
  exportCollection,
  exportAll
};