import { Secret } from 'src/types/secret';
import { TIdentity, TJSONIdentity } from './crypto.types';

export const generateKey = async (): Promise<CryptoKey> =>
  window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

export const generateIv = (): Uint8Array =>
  window.crypto.getRandomValues(new Uint8Array(12));

export const encryptData = (
  key: CryptoKey,
  iv: Uint8Array,
  encodedData: BufferSource
): Promise<ArrayBuffer> =>
  window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData
  );

export const decryptData = (
  key: CryptoKey,
  iv: Uint8Array,
  encryptedData: ArrayBuffer
): Promise<ArrayBuffer> =>
  window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);

export const exportIdentity = async (
  key: CryptoKey,
  iv: Uint8Array
): Promise<TJSONIdentity> => {
  const jwk = await window.crypto.subtle.exportKey('jwk', key);
  const ivArray = Array.from(iv);

  const identity = {
    key: jwk,
    iv: ivArray,
  };

  // TODO zod this?
  return identity;
};

export const importIdentity = async (
  identity: TJSONIdentity
): Promise<TIdentity> => {
  // TODO zod identity? Probs as it's user data
  const { key, iv } = identity;

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
