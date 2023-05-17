import { PropsWithChildren } from 'react';

import { TIdentity } from 'src/utils/crypto-v4';

export type TIdentityContext = {
  identity: TIdentity;
  setIdentity: (identity: TIdentity) => void;
  stringifiedIdentity: string;
  generateIdentity: () => Promise<void>;
};

export type TIdentityProviderProps = PropsWithChildren<Record<string, unknown>>;
