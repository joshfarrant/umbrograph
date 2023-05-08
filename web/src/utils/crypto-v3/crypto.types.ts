export type TIdentity = {
  key: CryptoKey;
  iv: Uint8Array;
};

export type TJSONIdentity = {
  key: JsonWebKey;
  iv: number[];
};
