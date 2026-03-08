import test from 'node:test';
import assert from 'node:assert/strict';

test('basic config sanity', () => {
  assert.equal(typeof process.version, 'string');
});
