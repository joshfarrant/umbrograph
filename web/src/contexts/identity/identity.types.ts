import { PropsWithChildren } from 'react';

export type TIdentityContext = {
  key: CryptoKey;
  setKey: (key: CryptoKey) => void;
  iv: Uint8Array;
  setIv: (iv: Uint8Array) => void;
  stringifiedIdentity: string;
  generateIdentity: () => Promise<void>;
};

export type TIdentityProviderProps = PropsWithChildren<Record<string, unknown>>;
