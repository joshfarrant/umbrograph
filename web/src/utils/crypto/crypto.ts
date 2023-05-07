import { v4 as uuid } from 'uuid';

import { Secret } from 'src/types/secret';
import invariant from 'tiny-invariant';

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // TODO don't use btoa
  return window.btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = Buffer.from(base64, 'base64');
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString[i];
  }

  return bytes.buffer;
};

export const fileToPreviewUrl = (file: File): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve) => {
    reader.addEventListener('load', () => {
      invariant(typeof reader.result === 'string');

      resolve(reader.result);
    });
  });
};

export const base64ToPreviewUrl = async (
  key: CryptoKey,
  iv: Uint8Array,
  fileType: string,
  base64: string
): Promise<string> => {
  const arrayBuffer = base64ToArrayBuffer(base64);

  const file = await decryptFileContents(key, iv, arrayBuffer, fileType);

  const previewUrl = fileToPreviewUrl(file);

  return previewUrl;
};

export const encryptFileContents = async (
  key: CryptoKey,
  iv: Uint8Array,
  file: File
): Promise<ArrayBuffer> => {
  const fileContents = await file.arrayBuffer();

  const arrayBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    fileContents
  );

  return arrayBuffer;
};

export const decryptFileContents = async (
  key: CryptoKey,
  iv: Uint8Array,
  encryptedContents: ArrayBuffer,
  fileType: string,
  fileName: string = uuid()
): Promise<File> => {
  const decryptedContents = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedContents
  );

  const decryptedFile = new File([decryptedContents], fileName, {
    type: fileType,
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
