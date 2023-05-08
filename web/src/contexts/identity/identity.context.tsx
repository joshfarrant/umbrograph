import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { TIdentityContext, TIdentityProviderProps } from './identity.types';
import { generateIdentity } from 'src/utils/crypto-v2';
import { TIdentity } from 'src/types/identity';

const IdentityContext = createContext<TIdentityContext | null>(null);

export const IdentityProvider = ({
  children,
}: TIdentityProviderProps): ReactElement => {
  const [identity, setIdentity] = useState<TIdentity | null>(null);

  const regenerateIdentity = async () => {
    const newIdentity = await generateIdentity();
    setIdentity(newIdentity);
  };

  useEffect(() => {
    regenerateIdentity();
  }, []);

  if (!identity) {
    return <span>Generating identity...</span>;
  }

  // prettier-ignore
  const {
    encryptionKeys: {
      publicKey: publicEncryptionKey,
      privateKey: privateEncryptionKey,
    },
    signingKeys: {
      publicKey: publicSigningKey,
      privateKey: privateSigningKey,
    },
  } = identity;

  return (
    <IdentityContext.Provider
      value={{
        publicEncryptionKey,
        privateEncryptionKey,
        publicSigningKey,
        privateSigningKey,
        setIdentity,
        regenerateIdentity,
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
