import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { generateIv, generateKey, exportIdentity } from 'src/utils/crypto-v3';
import { TIdentityContext, TIdentityProviderProps } from './identity.types';

const IdentityContext = createContext<TIdentityContext | null>(null);

export const IdentityProvider = ({
  children,
}: TIdentityProviderProps): ReactElement => {
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [iv, setIv] = useState<Uint8Array | null>(null);
  const [stringifiedIdentity, setStringifiedIdentity] = useState<string | null>(
    null
  );

  const generateIdentity = async () => {
    const newKey = await generateKey();
    setKey(newKey);

    const newIv = generateIv();
    setIv(newIv);
  };

  const stringifyIdentity = async () => {
    if (!key || !iv) {
      return;
    }

    const exportedIdentity = await exportIdentity(key, iv);
    const stringifiedIdentity = JSON.stringify(exportedIdentity, null, 2);

    setStringifiedIdentity(stringifiedIdentity);
  };

  useEffect(() => {
    generateIdentity();
  }, []);

  useEffect(() => {
    stringifyIdentity();
  }, [key, iv]);

  if (!key || !iv || !stringifiedIdentity) {
    return <span>Generating identity...</span>;
  }

  return (
    <IdentityContext.Provider
      value={{ key, setKey, iv, setIv, stringifiedIdentity, generateIdentity }}
    >
      {children}
    </IdentityContext.Provider>
  );
};

export const useIdentity = () => {
  const context = useContext(IdentityContext);

  invariant(context, 'useIdentity must be used within a IdentityProvider');

  return context;
};
