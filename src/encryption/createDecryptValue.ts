import { createDecipheriv } from 'node:crypto';

import type { Algorithm, EncryptedValue } from './types';

import { KEY_LENGTHS } from './constants';

/**
 * Create a function that decrypts encrypted payloads using the given algorithm and key.
 *
 * @param algorithm - Cipher algorithm to use (for example `'aes-256-cbc'`)
 * @param encryptionKey - Key used to initialize the decipher; must match the key used to encrypt the value
 * @returns A function that accepts an `EncryptedValue` and returns the decrypted plaintext string
 */
export function createDecryptValue(
  algorithm: Algorithm,
  encryptionKey: string,
) {
  if (KEY_LENGTHS[algorithm] == null) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  if (Buffer.byteLength(encryptionKey, 'utf8') !== KEY_LENGTHS[algorithm]) {
    throw new Error(
      `Invalid encryption key length for ${algorithm}. Expected length: ${KEY_LENGTHS[algorithm]} bytes.`,
    );
  }

  return (encryptedValue: EncryptedValue): string => {
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
