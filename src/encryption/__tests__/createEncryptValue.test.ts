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

    it('creates a function that encrypts values', () => {
      expect(typeof encryptValue).toBe('function');
    });

    it('returns an EncryptedValue object with iv and content', () => {
      const result = encryptValue('test');

      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('content');
      expect(typeof result.iv).toBe('string');
      expect(typeof result.content).toBe('string');
    });

    it('encrypts simple strings', () => {
      const result = encryptValue('hello world');

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/); // 16 bytes = 32 hex chars
      expect(result.content).toMatch(/^[0-9a-f]+$/); // Hex string
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('encrypts empty strings', () => {
      const result = encryptValue('');

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
      expect(result.content).toMatch(/^[0-9a-f]*$/); // May be empty or have padding
    });

    it('produces different IVs for identical inputs', () => {
      const result1 = encryptValue('test');
      const result2 = encryptValue('test');

      expect(result1.iv).not.toBe(result2.iv);
      expect(result1.content).not.toBe(result2.content);
    });

    it('produces different content for different inputs', () => {
      const result1 = encryptValue('test1');
      const result2 = encryptValue('test2');

      expect(result1.content).not.toBe(result2.content);
    });

    it('handles special characters and unicode', () => {
      const specialText = 'Hello! @#$%^&*()_+ 🚀 こんにちは';
      const result = encryptValue(specialText);

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
      expect(result.content).toMatch(/^[0-9a-f]+$/);
    });

    it('handles multiline strings', () => {
      const multiline = 'Line 1\nLine 2\r\nLine 3\tTabbed';
      const result = encryptValue(multiline);

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
      expect(result.content).toMatch(/^[0-9a-f]+$/);
    });

    it('handles very long strings', () => {
      const longString = 'a'.repeat(10000);
      const result = encryptValue(longString);

      expect(result.iv).toMatch(/^[0-9a-f]{32}$/);
      expect(result.content).toMatch(/^[0-9a-f]+$/);
      expect(result.content.length).toBeGreaterThan(0);
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

    it('decrypts previously encrypted values', () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = 'Hello, World!';

      const encrypted = encryptValue(originalText);
      const decrypted = decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('decrypts empty strings', () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = '';

      const encrypted = encryptValue(originalText);
      const decrypted = decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('decrypts special characters and unicode', () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = 'Special chars: @#$%^&*() 🎉 日本語';

      const encrypted = encryptValue(originalText);
      const decrypted = decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('decrypts multiline strings', () => {
      const encryptValue = createEncryptValue({
        algorithm,
        encryptionKey,
      });

      const originalText = 'Line 1\nLine 2\r\nLine 3\tWith tab';

      const encrypted = encryptValue(originalText);
      const decrypted = decryptValue(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('throws error for invalid encrypted values', () => {
      const invalidEncrypted: EncryptedValue = {
        iv: 'invalid',
        content: 'invalid',
      };

      expect(() => decryptValue(invalidEncrypted)).toThrow();
    });
  });

  describe('integration between encrypt and decrypt', () => {
    let encryptValue: ReturnType<typeof createEncryptValue>;
    let decryptValue: ReturnType<typeof createDecryptValue>;

    beforeEach(() => {
      encryptValue = createEncryptValue({ algorithm, encryptionKey });
      decryptValue = createDecryptValue({ algorithm, encryptionKey });
    });

    it('successfully encrypts and decrypts various text types', () => {
      const testCases = [
        'simple text',
        '',
        'Text with numbers: 12345',
        'Special chars: !@#$%^&*()',
        'Unicode: 🚀 こんにちは 🎉',
        'JSON: {"key": "value", "number": 42}',
        'XML: <root><item id="1">value</item></root>',
        'Multi\nLine\nText',
        'A'.repeat(1000), // Long text
      ];

      testCases.forEach((testCase) => {
        const encrypted = encryptValue(testCase);
        const decrypted = decryptValue(encrypted);

        expect(decrypted).toBe(testCase);
      });
    });

    it('maintains consistency across multiple encrypt/decrypt cycles', () => {
      const originalText = 'Test consistency';

      for (let i = 0; i < 10; i++) {
        const encrypted = encryptValue(originalText);
        const decrypted = decryptValue(encrypted);
        expect(decrypted).toBe(originalText);
      }
    });

    it('produces different encrypted values for same input', () => {
      const text = 'same input';
      const encrypted1 = encryptValue(text);
      const encrypted2 = encryptValue(text);

      // Different IVs and content
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      expect(encrypted1.content).not.toBe(encrypted2.content);

      // But both decrypt to same value
      expect(decryptValue(encrypted1)).toBe(text);
      expect(decryptValue(encrypted2)).toBe(text);
    });

    it('handles binary-like data (base64 strings)', () => {
      const base64Data = 'SGVsbG8gV29ybGQh'; // "Hello World!" in base64
      const encrypted = encryptValue(base64Data);
      const decrypted = decryptValue(encrypted);

      expect(decrypted).toBe(base64Data);
    });
  });

  describe('security properties', () => {
    let encryptValue: ReturnType<typeof createEncryptValue>;

    beforeEach(() => {
      encryptValue = createEncryptValue({ algorithm, encryptionKey });
    });

    it('generates cryptographically random IVs', () => {
      const ivs = new Set();
      const iterations = 100;

      // Generate many IVs and ensure they're all different
      for (let i = 0; i < iterations; i++) {
        const encrypted = encryptValue('test');
        ivs.add(encrypted.iv);
      }

      expect(ivs.size).toBe(iterations); // All IVs should be unique
    });

    it('produces different ciphertext for identical plaintext', () => {
      const ciphertexts = new Set();
      const iterations = 50;
      const plaintext = 'identical text';

      for (let i = 0; i < iterations; i++) {
        const encrypted = encryptValue(plaintext);
        ciphertexts.add(encrypted.content);
      }

      expect(ciphertexts.size).toBe(iterations); // All ciphertexts should be different
    });

    it('IV has correct length for AES', () => {
      const encrypted = encryptValue('test');

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
