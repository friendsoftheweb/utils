import type { EncryptedValue } from '../types';

import { createDecryptValue } from '../createDecryptValue';
import { createEncryptValue } from '../createEncryptValue';

describe('createEncryptValue and createDecryptValue', () => {
  const algorithm = 'aes-256-ctr';
  const encryptionKey = '0123456789abcdef0123456789abcdef'; // 32 bytes for AES-256

  describe('createEncryptValue', () => {
    let encryptValue: ReturnType<typeof createEncryptValue>;

    beforeEach(() => {
      encryptValue = createEncryptValue({ algorithm, encryptionKey });
    });

    it('returns an EncryptedValue object with iv and content', async () => {
      const result = await encryptValue('test');

      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('content');
      expect(typeof result.iv).toBe('string');
      expect(typeof result.content).toBe('string');
    });

    it('encrypts simple strings', async () => {
      const result = await encryptValue('hello world');

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/); // 16 bytes = 32 hex chars
      expect(result.content).toMatch(/^[0-9a-f]+$/); // Hex string
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('encrypts empty strings', async () => {
      const result = await encryptValue('');

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
      expect(result.content).toMatch(/^[0-9a-f]*$/); // May be empty or have padding
    });

    it('produces different IVs for identical inputs', async () => {
      const result1 = await encryptValue('test');
      const result2 = await encryptValue('test');

      expect(result1.iv).not.toBe(result2.iv);
      expect(result1.content).not.toBe(result2.content);
    });

    it('produces different content for different inputs', async () => {
      const result1 = await encryptValue('test1');
      const result2 = await encryptValue('test2');

      expect(result1.content).not.toBe(result2.content);
    });

    it('handles special characters and unicode', async () => {
      const specialText = 'Hello! @#$%^&*()_+ 🚀 こんにちは';
      const result = await encryptValue(specialText);

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
      expect(result.content).toMatch(/^[0-9a-f]+$/);
    });

    it('handles multiline strings', async () => {
      const multiline = 'Line 1\nLine 2\r\nLine 3\tTabbed';
      const result = await encryptValue(multiline);

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
      expect(result.content).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('createDecryptValue', () => {
    let decryptValue: ReturnType<typeof createDecryptValue>;

    beforeEach(() => {
      decryptValue = createDecryptValue({ algorithm, encryptionKey });
    });

    it('creates a function that decrypts values', () => {
      expect(typeof decryptValue).toBe('function');
    });

    it('decrypts previously encrypted values', async () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = 'Hello, World!';

      const encrypted = await encryptValue(originalText);
      const decrypted = await decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('decrypts empty strings', async () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = '';

      const encrypted = await encryptValue(originalText);
      const decrypted = await decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('decrypts special characters and unicode', async () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = 'Special chars: @#$%^&*() 🎉 日本語';

      const encrypted = await encryptValue(originalText);
      const decrypted = await decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('decrypts multiline strings', async () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = 'Line 1\nLine 2\r\nLine 3\tWith tab';

      const encrypted = await encryptValue(originalText);
      const decrypted = await decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('throws error for invalid encrypted values', async () => {
      const invalidEncrypted: EncryptedValue = {
        iv: 'invalid',
        content: 'invalid',
      };

      await expect(decryptValue(invalidEncrypted)).rejects.toThrow();
    });
  });

  describe('integration between encrypt and decrypt', () => {
    let encryptValue: ReturnType<typeof createEncryptValue>;
    let decryptValue: ReturnType<typeof createDecryptValue>;

    beforeEach(() => {
      encryptValue = createEncryptValue({ algorithm, encryptionKey });
      decryptValue = createDecryptValue({ algorithm, encryptionKey });
    });

    it('produces different encrypted values for same input', async () => {
      const text = 'same input';
      const encrypted1 = await encryptValue(text);
      const encrypted2 = await encryptValue(text);

      // Different IVs and content
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      expect(encrypted1.content).not.toBe(encrypted2.content);

      // But both decrypt to same value
      expect(await decryptValue(encrypted1)).toBe(text);
      expect(await decryptValue(encrypted2)).toBe(text);
    });
  });

  describe('security properties', () => {
    let encryptValue: ReturnType<typeof createEncryptValue>;

    beforeEach(() => {
      encryptValue = createEncryptValue({ algorithm, encryptionKey });
    });

    it('generates cryptographically random IVs', async () => {
      const ivs = new Set();
      const iterations = 100;

      // Generate many IVs and ensure they're all different
      for (let i = 0; i < iterations; i++) {
        const encrypted = await encryptValue('test');

        ivs.add(encrypted.iv);
      }

      expect(ivs.size).toBe(iterations); // All IVs should be unique
    });

    it('produces different ciphertext for identical plaintext', async () => {
      const ciphertexts = new Set();
      const iterations = 50;
      const plaintext = 'identical text';

      for (let i = 0; i < iterations; i++) {
        const encrypted = await encryptValue(plaintext);

        ciphertexts.add(encrypted.content);
      }

      expect(ciphertexts.size).toBe(iterations); // All ciphertexts should be different
    });

    it('IV has correct length for AES', async () => {
      const encrypted = await encryptValue('test');

      // AES block size is 16 bytes = 32 hex characters
      expect(encrypted.iv).toHaveLength(32);
    });
  });

  describe('error handling', () => {
    it('throws meaningful errors for invalid algorithm', () => {
      expect(() => {
        createEncryptValue({
          algorithm: 'invalid-algorithm' as any,
          encryptionKey,
        });
      }).toThrow();
    });

    it('throws meaningful errors for invalid key length', () => {
      const shortKey = '123'; // Too short for AES-256

      expect(() => {
        createEncryptValue({ algorithm, encryptionKey: shortKey });
      }).toThrow();
    });
  });
});
