import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import invariant from 'tiny-invariant';

import {
  generateIv,
  generateKey,
  exportIdentity,
  importIdentity,
} from 'src/utils/crypto-v3';

import { TIdentityContext, TIdentityProviderProps } from './identity.types';

const IdentityContext = createContext<TIdentityContext | null>(null);

const storeIdentity = async (stringifiedIdentity: string) => {
  localStorage.setItem('identity', stringifiedIdentity);
};

const retrieveIdentity = async () => {
  const identityString = localStorage.getItem('identity');

  if (!identityString) {
    return;
  }

  const jsonIdentity = JSON.parse(identityString);
  const identity = await importIdentity(jsonIdentity);
  return identity;
};

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
    retrieveIdentity().then((identity) => {
      if (!identity) {
        generateIdentity();
        return;
      }

      const { key, iv } = identity;
      setKey(key);
      setIv(iv);
    });
  }, []);

  useEffect(() => {
    stringifyIdentity();
  }, [key, iv]);

  useEffect(() => {
    if (stringifiedIdentity) {
      storeIdentity(stringifiedIdentity);
    }
  }, [stringifiedIdentity]);

  if (!key || !iv || !stringifiedIdentity) {
    return <span>Generating identity...</span>;
  }

  return (
    <IdentityContext.Provider
      value={{
        key,
        setKey,
        iv,
        setIv,
        stringifiedIdentity,
        generateIdentity,
      }}
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
