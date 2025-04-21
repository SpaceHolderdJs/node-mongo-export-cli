const { program } = require('commander');
const exporter = require('../lib/exporter');
const { getAllCollections } = require('../lib/utils');
const package = require('../package.json');

program
  .version(package.version)
  .description('Export MongoDB collections');

program
  .command('all')
  .description('Export all collections')
  .option('-o, --output <directory>', 'Output directory', './mongodb-export')
  .option('-u, --uri <uri>', 'MongoDB connection URI')
  .option('-d, --db <database>', 'Database name')
  .action(async (options) => {
    try {
      await exporter.exportAll(options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('collection <name>')
  .description('Export a specific collection')
  .option('-o, --output <directory>', 'Output directory', './mongodb-export')
  .option('-u, --uri <uri>', 'MongoDB connection URI')
  .option('-d, --db <database>', 'Database name')
  .action(async (name, options) => {
    try {
      await exporter.exportCollection(name, options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all available collections')
  .option('-u, --uri <uri>', 'MongoDB connection URI')
  .option('-d, --db <database>', 'Database name')
  .action(async (options) => {
    try {
      const collections = await getAllCollections(options);
      console.log('Available collections:');
      collections.forEach(collection => console.log(`- ${collection}`));
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}