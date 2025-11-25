import { createDecipheriv } from 'node:crypto';

import type { Algorithm, EncryptedValue } from './types';

export function createDecryptValue(
  algorithm: Algorithm,
  encryptionKey: string,
) {
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
