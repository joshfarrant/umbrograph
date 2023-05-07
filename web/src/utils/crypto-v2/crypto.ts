import { TIdentity, TJSONIdentity } from './crypto.types';

const ENCRYPTION_KEY_ALGORITHM = 'RSA-OAEP';
const SIGNING_KEY_ALGORITHM = 'RSA-PSS';

const ALGS = {
  ENCRYPTION: {
    name: ENCRYPTION_KEY_ALGORITHM,
    hash: 'SHA-256',
  },
  SIGNING: {
    name: SIGNING_KEY_ALGORITHM,
    hash: 'SHA-256',
  },
};

// TODO Do I need these?
// const encoder = new TextEncoder();
// const decoder = new TextDecoder();

// const encodeData = (data: string): Uint8Array => encoder.encode(data);
// const decodeData = (data: BufferSource): string => decoder.decode(data);

const generateEncryptionKeyPair = (): Promise<CryptoKeyPair> =>
  window.crypto.subtle.generateKey(
    {
      ...ALGS.ENCRYPTION,
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ['encrypt', 'decrypt']
  );

const generateSigningKeyPair = (): Promise<CryptoKeyPair> =>
  window.crypto.subtle.generateKey(
    {
      ...ALGS.SIGNING,
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ['sign', 'verify']
  );

export const encryptData = (
  publicKey: CryptoKey,
  encodedData: Uint8Array
): Promise<ArrayBuffer> =>
  window.crypto.subtle.encrypt(
    {
      name: ENCRYPTION_KEY_ALGORITHM,
    },
    publicKey,
    encodedData
  );

export const decryptData = (
  privateKey: CryptoKey,
  encryptedData: ArrayBuffer
): Promise<ArrayBuffer> =>
  window.crypto.subtle.decrypt(
    { name: ENCRYPTION_KEY_ALGORITHM },
    privateKey,
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

const exportKey = (key: CryptoKey): Promise<JsonWebKey> =>
  window.crypto.subtle.exportKey('jwk', key);

const importKey =
  (algorithm: AlgorithmIdentifier, keyUsage: KeyUsage[]) =>
  (jwk: JsonWebKey): Promise<CryptoKey> =>
    window.crypto.subtle.importKey('jwk', jwk, algorithm, true, keyUsage);

const importPublicEncryptionKey = importKey(ALGS.ENCRYPTION, ['encrypt']);
const importPrivageEncryptionKey = importKey(ALGS.ENCRYPTION, ['decrypt']);
const importPublicSigning = importKey(ALGS.SIGNING, ['verify']);
const importPrivateSigning = importKey(ALGS.SIGNING, ['sign']);

export const exportIdentity = async (
  identity: TIdentity
): Promise<TJSONIdentity> => {
  const [
    publicEncryptionKey,
    privateEncryptionKey,
    publicSigningKey,
    privateSigningKey,
  ] = await Promise.all([
    exportKey(identity.encryptionKeys.publicKey),
    exportKey(identity.encryptionKeys.privateKey),
    exportKey(identity.signingKeys.publicKey),
    exportKey(identity.signingKeys.privateKey),
  ]);

  return {
    publicEncryptionKey,
    privateEncryptionKey,
    publicSigningKey,
    privateSigningKey,
  };
};

export const importIdentity = async (
  identity: TJSONIdentity
): Promise<TIdentity> => {
  const [
    publicEncryptionKey,
    privateEncryptionKey,
    publicSigningKey,
    privateSigningKey,
  ] = await Promise.all([
    importPublicEncryptionKey(identity.publicEncryptionKey),
    importPrivageEncryptionKey(identity.privateEncryptionKey),
    importPublicSigning(identity.publicSigningKey),
    importPrivateSigning(identity.privateSigningKey),
  ]);

  return {
    encryptionKeys: {
      publicKey: publicEncryptionKey,
      privateKey: privateEncryptionKey,
    },
    signingKeys: {
      publicKey: publicSigningKey,
      privateKey: privateSigningKey,
    },
  };
};

export const generateIdentity = async (): Promise<TIdentity> => {
  const [encryptionKeys, signingKeys] = await Promise.all([
    generateEncryptionKeyPair(),
    generateSigningKeyPair(),
  ]);

  return {
    encryptionKeys,
    signingKeys,
  };
};

export const cryptoTest = async () => {
  const identity = await generateIdentity();
  console.debug('identity:', identity);
  const exportedIdentity = await exportIdentity(identity);
  console.debug('exportedIdentity:', exportedIdentity);
  const importedIdentity = await importIdentity(exportedIdentity);
  console.debug('importedIdentity:', importedIdentity);
};
