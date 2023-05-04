import { PropsWithChildren } from 'react';

export type TSecretsContext = {
  key: CryptoKey;
  setKey: (key: CryptoKey) => void;
  iv: Uint8Array;
  setIv: (iv: Uint8Array) => void;
  stringifiedSecrets: string;
  generateSecrets: () => Promise<void>;
};

export type TSectetsProviderProps = PropsWithChildren<Record<string, unknown>>;
