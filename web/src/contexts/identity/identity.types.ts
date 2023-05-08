import { PropsWithChildren } from 'react';
import { TIdentity } from 'src/types/identity';

export type TIdentityContext = {
  publicEncryptionKey: CryptoKey;
  privateEncryptionKey: CryptoKey;
  publicSigningKey: CryptoKey;
  privateSigningKey: CryptoKey;
  setIdentity: (identity: TIdentity) => void;
  regenerateIdentity: () => void;
};

export type TIdentityProviderProps = PropsWithChildren<Record<string, unknown>>;
