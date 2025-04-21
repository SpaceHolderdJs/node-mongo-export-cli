# MongoDB Export CLI Tool

A command-line utility for exporting MongoDB collections and schemas.

## Installation

```bash
npm install -g node-mongo-export-cli

```

## Features

- Export all collections from a MongoDB database
- Export specific collections by name
- Generate schema documentation from collections
- Customizable output formats and locations
- Secure credential handling via environment variables

## Usage

```bash
mongo-export all --uri="mongodb+srv://username:password@host/db" --output="./my-exports"
```


## Export a specific collection

```bash
mongo-export collection products --uri="mongodb+srv://username:password@host/db"
```

## List all available collections:

```bash
mongo-export list --uri="mongodb+srv://username:password@host/db"
```


## Generate schema documentation:

```bash
mongo-export schema --uri="mongodb+srv://username:password@host/db" --format="markdown"
```

## Using environment variables

Instead of passing connection details via command line, you can create a .env file with:

```bash
MONGODB_URI=mongodb+srv://username:password@host/db
MONGODB_DB=your-database-name
```

Then simply run:

```bash
mongo-export all
```

## Options

- -u, --uri <uri>: MongoDB connection URI
- -d, --db <database>: Database name
- -o, --output <directory>: Output directory (defaults to './mongodb-export')
- -f, --format <format>: Output format for schema (json, markdown, html)
- -p, --pretty: Pretty print JSON output
- -v, --version: Show version number
- -h, --help: Show help

## Examples

Export all collections with pretty-printed JSON:

```bash
mongo-export all --pretty
```

Export a specific collection to a custom location:

```bash
mongo-export collection users --output="./backup/users"
```

Generate markdown schema documentation:

```bash
mongo-export schema --format="markdown" --output="./docs"
```

Authentication with Configuration File

```json
    {
  "uri": "mongodb+srv://username:password@host/db",
  "db": "your-database",
  "options": {
    "useNewUrlParser": true,
    "useUnifiedTopology": true
  }
}
```

Then use it:

```bash
mongo-export all --config="./mongo-config.json"
```

Security Considerations
When working with MongoDB exports, be mindful of sensitive data:

- Never commit or share files containing connection strings with passwords
- Use environment variables for credentials in production environments
- Consider using MongoDB Atlas Data API for more secure access

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT