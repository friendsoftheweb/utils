import { randomBytes, createCipheriv } from 'node:crypto';

import type { Algorithm, EncryptedValue } from './types';

const KEY_LENGTHS: Record<Algorithm, number> = {
  'aes-256-ctr': 32,
};

/**
 * Create a reusable encryptor function for the given algorithm and key.
 *
 * @param algorithm - Cipher algorithm to use (must be supported by this module)
 * @param encryptionKey - Encryption key string whose length must match the algorithm's required key length
 * @returns A function that encrypts a string and returns an `EncryptedValue` with hex-encoded `iv` and `content`
 * @throws Error if the provided algorithm is unsupported
 * @throws Error if the `encryptionKey` length does not match the required length for the algorithm
 */
export function createEncryptValue(
  algorithm: Algorithm,
  encryptionKey: string,
) {
  if (KEY_LENGTHS[algorithm] == null) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  if (encryptionKey.length !== KEY_LENGTHS[algorithm]) {
    throw new Error(
      `Invalid encryption key length for ${algorithm}. Expected length: ${KEY_LENGTHS[algorithm]} characters.`,
    );
  }

  return (value: string): EncryptedValue => {
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, encryptionKey, iv);
    const content = Buffer.concat([cipher.update(value), cipher.final()]);

    return {
      iv: iv.toString('hex'),
      content: content.toString('hex'),
    };
  };
}
