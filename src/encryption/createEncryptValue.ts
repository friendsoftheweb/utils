import { randomBytes, createCipheriv } from 'node:crypto';

import type { Algorithm, EncryptedValue } from './types';

const KEY_LENGTHS: Record<Algorithm, number> = {
  'aes-256-ctr': 32,
};

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
