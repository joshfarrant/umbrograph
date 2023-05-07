export type TIdentity = {
  encryptionKeys: CryptoKeyPair;
  signingKeys: CryptoKeyPair;
};

export type TJSONIdentity = {
  publicEncryptionKey: JsonWebKey;
  privateEncryptionKey: JsonWebKey;
  publicSigningKey: JsonWebKey;
  privateSigningKey: JsonWebKey;
};
