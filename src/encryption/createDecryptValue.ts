import type { Algorithm, EncryptedValue } from './types';

import { KEY_LENGTHS } from './constants';

/**
 * Create a function that decrypts encrypted payloads using the given algorithm and key.
 *
 * @param options - Decryptor options
 * @param options.algorithm - Cipher algorithm to use (must be supported by this module)
 * @param options.encryptionKey - Encryption key string whose length must match the algorithm's required key length
 * @returns A function that accepts an `EncryptedValue` and returns the decrypted plaintext string
 */
export function createDecryptValue(options: {
  algorithm: Algorithm;
  encryptionKey: string;
}) {
  // Require 'crypto' module inline to avoid loading it in environments where
  // it's not needed/supported

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createDecipheriv } = require('node:crypto');

  const { algorithm, encryptionKey } = options;

  if (KEY_LENGTHS[algorithm] == null) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  if (Buffer.byteLength(encryptionKey, 'utf8') !== KEY_LENGTHS[algorithm]) {
    throw new Error(
      `Invalid encryption key length for ${algorithm}. Expected length: ${KEY_LENGTHS[algorithm]} bytes.`,
    );
  }

  return function decryptValue(encryptedValue: EncryptedValue): string {
    const decipher = createDecipheriv(
      algorithm,
      encryptionKey,
      Buffer.from(encryptedValue.iv, 'hex'),
    );

    const value = Buffer.concat([
      decipher.update(Buffer.from(encryptedValue.content, 'hex')),
      decipher.final(),
    ]);

    return value.toString();
  };
}
