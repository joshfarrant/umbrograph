import { PropsWithChildren } from 'react';

import { TIdentity } from 'src/utils/crypto-v4';

export type TIdentityContext = {
  identity: TIdentity | null;
  setIdentity: (identity: TIdentity | null) => void;
  stringifiedIdentity: string | null;
  generateIdentity: () => Promise<TIdentity>;
  digest: string | null;
};

export type TIdentityProviderProps = PropsWithChildren<Record<string, unknown>>;
