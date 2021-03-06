# Description

Reads any sheet of a Google spreadsheet document and returns the content as JSON data. Only supports of **Node.js**
environment.

# API

The package represents a function with the following signature:

```
readSpreadsheet(spreadsheetId[, options]);
```

where:

- `spreadsheetId` is the ID of a **public** Google spreadsheet document. You can get it from here:
  ![screenshot of spreadsheetId](docs/screenshot1.png)

- `options` is an object which can contain:
    - `isArray` (boolean) - defines if content must be returned as JSON array (if `true`) or JSON object (if `false`);
      default: `false`;
    - `gid` (string) - sets an ID of a sheet from a spreadsheet document; the 1st sheet is read if not set;
      default: `null`. You can get it from here:
      ![screenshot of gid](docs/screenshot2.png)
    - `isStream` (boolean) - defines if content is represented as a readable stream with processed data (if `true`) or
      just stringified data (if `false`); default: `false`.

# Usage

1. Init a new project:
   ```bash
   npm init -y
   ```

2. Install the package:
   ```bash
   npm i read-spreadsheet
   ```

3. Create `index.js` file with the following content:
   ```javascript
   const readSpreadsheet = require('read-spreadsheet');
   
   (async () => {
     // use your real spreadsheet ID!
     const content = await readSpreadsheet('u193j19jr-q9ew8ur98urq-32uruwr1h2k3h1k');
   
     // just to print it in the readable format
     console.log(JSON.stringify(content, null, 2));
   })();
   ```

4. Run it:
   ```bash
   node ./index.js
   ```

# FAQ

### 1. What if a spreadsheet document doesn't exist by the ID?

You will get an exception about wrong ID.

### 2. What if a spreadsheet document doesn't have public access?

You will get an exception about with the particular description.

### 3. What if some cells are merged vertically or horizontally?

You will get the same content as if none of the cells were merged. Instead of content for merged cells you will get an
empty string.

### 4. What if a spreadsheet document contains some images or diagrams?

All graphic elements will be ignored and every such cell will contain just an empty string.

### 5. What if a spreadsheet sheet doesn't exist by "gid"?

You will get "null".

# Testing

1. Before running tests you need to define 2 environment variables in `.env` file:
   ```
   PUBLIC_SPREADSHEET_ID=?
   NON_PUBLIC_SPREADSHEET_ID=?
   ```

2. To run tests:
   ```shell
   npm run test
   ```
