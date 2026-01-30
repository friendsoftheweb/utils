export interface EncryptedValue {
  iv: string;
  content: string;
}

export type Algorithm = 'aes-256-ctr';
