import { pipe } from 'fp-ts/lib/function';

import {
  getPrivateEncryptionIv,
  getPrivateEncryptionKey,
  getPrivateSigningKey,
  getPublicSigningKey,
} from './crypto.optics';
import { JsonIdentitySchema, TIdentity, TJsonIdentity } from './crypto.types';

const ENCRYPTION_KEY_ALGORITHM: AlgorithmIdentifier = 'AES-GCM';
const SIGNING_KEY_ALGORITHM: AlgorithmIdentifier = 'RSA-PSS';

export const generateEncryptionKey = async (): Promise<CryptoKey> =>
  window.crypto.subtle.generateKey(
    {
      name: ENCRYPTION_KEY_ALGORITHM,
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

const generateSigningKeyPair = (): Promise<CryptoKeyPair> =>
  window.crypto.subtle.generateKey(
    {
      name: SIGNING_KEY_ALGORITHM,
      hash: 'SHA-256',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ['sign', 'verify']
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
      name: ENCRYPTION_KEY_ALGORITHM,
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
  window.crypto.subtle.decrypt(
    { name: ENCRYPTION_KEY_ALGORITHM, iv },
    key,
    encryptedData
  );

export const signData = (
  privateKey: CryptoKey,
  encodedData: Uint8Array
): Promise<ArrayBuffer> =>
  window.crypto.subtle.sign(
    {
      name: SIGNING_KEY_ALGORITHM,
      saltLength: 32,
    },
    privateKey,
    encodedData
  );

export const verifyData = (
  publicKey: CryptoKey,
  encodedData: Uint8Array,
  signature: ArrayBuffer
): Promise<boolean> =>
  window.crypto.subtle.verify(
    {
      name: SIGNING_KEY_ALGORITHM,
      saltLength: 32,
    },
    publicKey,
    signature,
    encodedData
  );

export const createPublicDigestFromKey = async (
  key: CryptoKey
): Promise<string> => {
  const encoder = new TextEncoder();
  const jwk = await window.crypto.subtle.exportKey('jwk', key);
  const data = encoder.encode(JSON.stringify(jwk));
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const importKey =
  (algorithm: AlgorithmIdentifier, keyUsage: KeyUsage[]) =>
  (jwk: JsonWebKey): Promise<CryptoKey> =>
    window.crypto.subtle.importKey('jwk', jwk, algorithm, true, keyUsage);

const importEncryptionKey = importKey(ENCRYPTION_KEY_ALGORITHM, [
  'encrypt',
  'decrypt',
]);
const importPublicSigningKey = importKey(SIGNING_KEY_ALGORITHM, ['verify']);
const importPrivateSigningKey = importKey(SIGNING_KEY_ALGORITHM, ['sign']);

export const importIdentity = async (
  jsonIdentity: TJsonIdentity
): Promise<TIdentity> => {
  JsonIdentitySchema.parse(jsonIdentity);

  const [publicSigningKey, privateSigningKey, encryptionKey] =
    await Promise.all([
      pipe(jsonIdentity, getPublicSigningKey, importPublicSigningKey),
      pipe(jsonIdentity, getPrivateSigningKey, importPrivateSigningKey),
      pipe(jsonIdentity, getPrivateEncryptionKey, importEncryptionKey),
    ]);

  const identity = {
    keys: {
      public: {
        signing: publicSigningKey,
      },
      private: {
        encryption: {
          key: encryptionKey,
          iv: new Uint8Array(getPrivateEncryptionIv(jsonIdentity)),
        },
        signing: privateSigningKey,
      },
    },
  };

  return identity;
};

const exportKey = (key: CryptoKey): Promise<JsonWebKey> =>
  window.crypto.subtle.exportKey('jwk', key);

export const exportIdentity = async (
  identity: TIdentity
): Promise<TJsonIdentity> => {
  const [publicSigningKey, privateSigningKey, encryptionKey] =
    await Promise.all([
      pipe(identity, getPublicSigningKey, exportKey),
      pipe(identity, getPrivateSigningKey, exportKey),
      pipe(identity, getPrivateEncryptionKey, exportKey),
    ]);

  const ivArray = Array.from(getPrivateEncryptionIv(identity));

  const jsonIdentity = {
    version: 'v1' as const,
    keys: {
      public: {
        signing: publicSigningKey,
      },
      private: {
        encryption: {
          key: encryptionKey,
          iv: ivArray,
        },
        signing: privateSigningKey,
      },
    },
  };

  JsonIdentitySchema.parse(jsonIdentity);

  return jsonIdentity;
};

export const generateIdentity = async (): Promise<TIdentity> => {
  const [encryptionKey, signingKeys] = await Promise.all([
    generateEncryptionKey(),
    generateSigningKeyPair(),
  ]);

  const iv = generateIv();

  const identity = {
    keys: {
      public: {
        signing: signingKeys.publicKey,
      },
      private: {
        encryption: {
          key: encryptionKey,
          iv,
        },
        signing: signingKeys.privateKey,
      },
    },
  };

  return identity;
};
