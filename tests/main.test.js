const { Readable } = require('stream');
const readSpreadsheet = require('../index');

const publicSpreadsheetId = process.env.PUBLIC_SPREADSHEET_ID;
const nonPublicSpreadsheetId = process.env.NON_PUBLIC_SPREADSHEET_ID;

const streamToString = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
};

const correctArray = (result) => {
  expect(result).not.toBeNull();
  expect(Array.isArray(result)).toBe(true);

  if (result && result.length) {
    result.every((el1) => {
      expect(el1).not.toBeNull();
      expect(typeof el1).toBe('object');
      expect(Array.isArray(el1)).toBe(true);

      if (el1 && el1.length) {
        expect(
          el1.every((el2) => {
            return typeof el2 === 'string';
          }),
        ).toBe(true);
      }
    });
  }
};

const correctJson = (result) => {
  expect(result).not.toBeNull();
  expect(Array.isArray(result)).toBe(true);

  if (result && result.length) {
    result.every((el1) => {
      expect(el1).not.toBeNull();
      expect(typeof el1).toBe('object');
      expect(Array.isArray(el1)).toBe(false);

      const keys = Object.keys(el1);
      const values = Object.values(el1);

      if (keys.length) {
        expect(
          keys.every((el2) => {
            return typeof el2 === 'string';
          }),
        ).toBe(true);
        expect(
          values.every((el2) => {
            return typeof el2 === 'string';
          }),
        ).toBe(true);
      }
    });
  }
};

describe('Node.js environment', () => {
  describe('Negative cases', () => {
    test('without spreadsheet ID', async () => {
      let result = null;

      try {
        result = await readSpreadsheet();
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Spreadsheet document ID is wrong');
      }

      expect(result).toBe(null);
    });

    test('with wrong spreadsheet ID', async () => {
      let result = null;

      try {
        result = await readSpreadsheet('$ome-wr0ng-spre@dsheet-1d-Walue');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 404');
      }

      expect(result).toBe(null);
    });

    test('with non-string spreadsheet ID', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(new Date());
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 404');
      }

      expect(result).toBe(null);
    });

    test('with non-public spreadsheet ID', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(nonPublicSpreadsheetId);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Spreadsheet document has non-public access');
      }

      expect(result).toBe(null);
    });

    test('with correct spreadsheet ID, but with wrong type of options', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(publicSpreadsheetId, () => {
          console.warn('bla-bla-bla');
        });
      } catch (error) {
        expect(true).toBe(false);
      }

      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
    });

    test('with correct spreadsheet ID, but with empty object of options', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(publicSpreadsheetId, {});
      } catch (error) {
        expect(true).toBe(false);
      }

      correctArray(result);
    });

    test('with correct spreadsheet ID, but with wrong type of "isJson" option (not NULL!)', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(publicSpreadsheetId, {
          isJson: () => console.error('foo'),
        });
      } catch (error) {
        expect(true).toBe(false);
      }

      correctJson(result);
    });

    test('with correct spreadsheet ID, but with NULL gid', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(publicSpreadsheetId, {
          gid: null,
        });
      } catch (error) {
        expect(true).toBe(false);
      }

      correctArray(result);
    });

    test('with correct spreadsheet ID, but with non-existent gid', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(publicSpreadsheetId, {
          gid: '$ome-n0n-exisTent-g1d',
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }

      expect(result).toBe(null);
    });

    test('with correct spreadsheet ID, but with wrong type of gid', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(publicSpreadsheetId, {
          gid: Symbol('foo-bar'),
        });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }

      expect(result).toBe(null);
    });

    test('with correct spreadsheet ID, but with wrong type of "isStream" option (not NULL!)', async () => {
      let result = null;

      try {
        result = await readSpreadsheet(publicSpreadsheetId, {
          isStream: Symbol('$ome-wr0ng-W@lue'),
        });
      } catch (error) {
        expect(true).toBe(false);
      }

      expect(result).not.toBe(null);
      expect(result instanceof Readable).toBe(true);
      expect(typeof result.pipe).toBe('function');
    });
  });

  describe('Positive cases', () => {
    test('with public spreadsheet ID and without any options', async () => {
      const result = await readSpreadsheet(publicSpreadsheetId);

      correctArray(result);
    });

    test('with public spreadsheet ID and as JSON', async () => {
      const result = await readSpreadsheet(publicSpreadsheetId, {
        isJson: true,
      });

      correctJson(result);
    });

    test('with public spreadsheet ID and array as stream', async () => {
      const result = await readSpreadsheet(publicSpreadsheetId, {
        isStream: true,
      });
      const data = await streamToString(result);

      correctArray(JSON.parse(data));
    });

    test('with public spreadsheet ID and JSON as stream', async () => {
      const result = await readSpreadsheet(publicSpreadsheetId, {
        isJson: true,
        isStream: true,
      });
      const data = await streamToString(result);

      correctJson(JSON.parse(data));
    });
  });
});
