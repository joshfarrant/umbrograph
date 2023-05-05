import { v4 as uuid } from 'uuid';

import { Secret } from 'src/types/secret';

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = Buffer.from(base64, 'base64');
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString[i];
  }

  return bytes.buffer;
};

export const encryptFileContents = async (
  key: CryptoKey,
  iv: Uint8Array,
  file: File
): Promise<{ encryptedFile: Blob; iv: Uint8Array }> => {
  const fileContents = await file.arrayBuffer();

  const encryptedContents = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    fileContents
  );

  const encryptedFile = new Blob([encryptedContents], { type: file.type });
  return { encryptedFile, iv };
};

export const decryptFileContents = async (
  key: CryptoKey,
  iv: Uint8Array,
  encryptedFile: Blob,
  fileName: string = uuid()
): Promise<File> => {
  const encryptedContents = await encryptedFile.arrayBuffer();
  const decryptedContents = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedContents
  );

  const decryptedFile = new File([decryptedContents], fileName, {
    type: encryptedFile.type,
  });

  return decryptedFile;
};

export const generateKey = async (): Promise<CryptoKey> =>
  window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

export const generateIv = () =>
  window.crypto.getRandomValues(new Uint8Array(12));

export const stringifyKey = async (key: CryptoKey): Promise<string> => {
  const jwk = await window.crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(jwk, null, 2);
};

export const stringifySecrets = async (
  key: CryptoKey,
  iv: Uint8Array
): Promise<string> => {
  const jwk = await window.crypto.subtle.exportKey('jwk', key);

  const data = {
    key: jwk,
    iv: Array.from(iv),
  };

  const secret = Secret.parse(data);

  return JSON.stringify(secret, null, 2);
};

export const importSecrets = async (
  data: unknown
): Promise<{ key: CryptoKey; iv: Uint8Array }> => {
  const secret = Secret.parse(data);
  const { key, iv } = secret;

  const importedKey = await window.crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: 'AES-GCM',
    },
    true,
    ['encrypt', 'decrypt']
  );

  return { key: importedKey, iv: new Uint8Array(iv) };
};
