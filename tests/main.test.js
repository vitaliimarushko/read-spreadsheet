require('dotenv').config();

const { Readable } = require('stream');
const readSpreadsheet = require('../index');
const assert = require('assert');

const publicSpreadsheetId = process.env.PUBLIC_SPREADSHEET_ID;
const nonPublicSpreadsheetId = process.env.NON_PUBLIC_SPREADSHEET_ID;

const streamToStructure = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(chunks));
  });
};

const assertCorrectObject = (result) => {
  assert.notEqual(result, null);
  assert.equal(Array.isArray(result), true);

  if (result && result.length) {
    result.every((el1) => {
      assert.notEqual(el1, null);
      assert.equal(typeof el1, 'object');
      assert.equal(Array.isArray(el1), false);

      const keys = Object.keys(el1);
      const values = Object.values(el1);

      if (keys.length) {
        assert.equal(
          keys.every((el2) => {
            return typeof el2 === 'string';
          }),
          true,
        );
        assert.equal(
          values.every((el2) => {
            return typeof el2 === 'string';
          }),
          true,
        );
      }
    });
  }
};

const assertCorrectArray = (result) => {
  assert.notEqual(result, null);
  assert.equal(Array.isArray(result), true);

  if (result && result.length) {
    result.every((el1) => {
      assert.notEqual(el1, null);
      assert.equal(typeof el1, 'object');
      assert.equal(Array.isArray(el1), true);

      if (el1 && el1.length) {
        assert.equal(
          el1.every((el2) => {
            return typeof el2 === 'string';
          }),
          true,
        );
      }
    });
  }
};

describe('Negative cases', () => {
  it('without spreadsheet ID', async () => {
    let result = null;

    try {
      result = await readSpreadsheet();
      assert.equal(true, false);
    } catch (error) {
      assert.equal(error.message, 'Spreadsheet document ID is wrong');
    }

    assert.equal(result, null);
  });

  it('with wrong spreadsheet ID', async () => {
    let result = null;

    try {
      result = await readSpreadsheet('$ome-wr0ng-spre@dsheet-1d-Walue');
      assert.equal(true, false);
    } catch (error) {
      assert.equal(error.message, 'Request failed with status code 404');
    }

    assert.equal(result, null);
  });

  it('with non-string spreadsheet ID', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(new Date());
      assert.equal(true, false);
    } catch (error) {
      assert.equal(error.message, 'Request failed with status code 404');
    }

    assert.equal(result, null);
  });

  it('with non-public spreadsheet ID', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(nonPublicSpreadsheetId);
      assert.equal(true, false);
    } catch (error) {
      assert.equal(error.message, 'Spreadsheet document has non-public access');
    }

    assert.equal(result, null);
  });

  it('with correct spreadsheet ID, but with wrong type of options', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(publicSpreadsheetId, () => {
        console.warn('bla-bla-bla');
      });
    } catch (error) {
      assert.equal(true, false);
    }

    assert.notEqual(result, null);
    assert.equal(Array.isArray(result), true);
  });

  it('with correct spreadsheet ID, but with empty object of options', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(publicSpreadsheetId, {});
    } catch (error) {
      assert.equal(true, false);
    }

    assertCorrectObject(result);
  });

  it('with correct spreadsheet ID, but with wrong type of "isArray" option (not NULL!)', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(publicSpreadsheetId, {
        isArray: () => console.error('foo'),
      });
    } catch (error) {
      assert.equal(true, false);
    }

    assertCorrectArray(result);
  });

  it('with correct spreadsheet ID, but with NULL gid', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(publicSpreadsheetId, {
        gid: null,
      });
    } catch (error) {
      assert.equal(true, false);
    }

    assertCorrectObject(result);
  });

  it('with correct spreadsheet ID, but with non-existent gid', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(publicSpreadsheetId, {
        gid: '$ome-n0n-exisTent-g1d',
      });
      assert.equal(true, false);
    } catch (error) {
      assert.equal(error.message, 'Request failed with status code 400');
    }

    assert.equal(result, null);
  });

  it('with correct spreadsheet ID, but with wrong type of gid', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(publicSpreadsheetId, {
        gid: Symbol('foo-bar'),
      });
      assert.equal(true, false);
    } catch (error) {
      assert.equal(error.message, 'Request failed with status code 400');
    }

    assert.equal(result, null);
  });

  it('with correct spreadsheet ID, but with wrong type of "isStream" option (not NULL!)', async () => {
    let result = null;

    try {
      result = await readSpreadsheet(publicSpreadsheetId, {
        isStream: Symbol('$ome-wr0ng-W@lue'),
      });
    } catch (error) {
      assert.equal(true, false);
    }

    assert.notEqual(result, null);
    assert.equal(result instanceof Readable, true);
    assert.equal(typeof result.pipe, 'function');
  });
});

describe('Positive cases', () => {
  it('with public spreadsheet ID and without any options', async () => {
    const result = await readSpreadsheet(publicSpreadsheetId);

    assertCorrectObject(result);
  });

  it('with public spreadsheet ID and as array', async () => {
    const result = await readSpreadsheet(publicSpreadsheetId, {
      isArray: true,
    });

    assertCorrectArray(result);
  });

  it('with public spreadsheet ID and array as stream', async () => {
    const result = await readSpreadsheet(publicSpreadsheetId, {
      isStream: true,
    });
    const data = await streamToStructure(result);

    assertCorrectObject(data);
  });

  it('with public spreadsheet ID and array as stream', async () => {
    const result = await readSpreadsheet(publicSpreadsheetId, {
      isArray: true,
      isStream: true,
    });
    const data = await streamToStructure(result);

    assertCorrectArray(data);
  });
});
