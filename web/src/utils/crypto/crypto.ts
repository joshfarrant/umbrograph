import invariant from 'tiny-invariant';
import { v4 as uuid } from 'uuid';

import { Secret } from 'src/types/secret';

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
