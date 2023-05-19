import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import invariant from 'tiny-invariant';

import {
  generateIdentity,
  exportIdentity,
  importIdentity,
  type TIdentity,
  JsonIdentitySchema,
} from 'src/utils/crypto-v4';

import { TIdentityContext, TIdentityProviderProps } from './identity.types';

const IdentityContext = createContext<TIdentityContext | null>(null);

const setIdentityInLocalStorage = async (stringifiedIdentity: string) => {
  localStorage.setItem('identity', stringifiedIdentity);
};

const getIdentityFromLocalStorage = async (): Promise<TIdentity | null> => {
  const identityString = localStorage.getItem('identity');

  if (!identityString) {
    return null;
  }

  try {
    const jsonIdentity = JSON.parse(identityString);
    JsonIdentitySchema.safeParse(jsonIdentity);

    const identity = await importIdentity(jsonIdentity);

    return identity;
  } catch (error) {
    console.error('Error getting identity from local storage', error);
    return null;
  }
};

export const IdentityProvider = ({
  children,
}: TIdentityProviderProps): ReactElement => {
  const [identity, setIdentity] = useState<TIdentity | null>(null);
  const [stringifiedIdentity, setStringifiedIdentity] = useState<string | null>(
    null
  );

  const generateAndSetIdentity = async () => {
    const newIdentity = await generateIdentity();
    setIdentity(newIdentity);
  };

  useEffect(() => {
    getIdentityFromLocalStorage().then((storedIdentity) => {
      if (storedIdentity) {
        setIdentity(storedIdentity);
        return;
      }

      /**
       * TODO Maybe I should be a bit more careful here. If
       * the identity in localStorage isn't valid am I ok just
       * deleting it completely as I'm doing here, or might
       * user still need it, in which case I should tell them
       * what's happened and maybe back up the identity into
       * a different localStorge variable until they decide
       * what to do. I should be quite aggressive in prompting
       * them to decide as having it hang around could be a
       * security issue. Ideally we want it gone.
       */
      generateAndSetIdentity();
    });
  }, []);

  useEffect(() => {
    const stringifyIdentity = async () => {
      if (!identity) {
        return;
      }

      const exportedIdentity = await exportIdentity(identity);
      const stringifiedIdentity = JSON.stringify(exportedIdentity, null, 2);

      setStringifiedIdentity(stringifiedIdentity);
    };

    stringifyIdentity();
  }, [identity]);

  useEffect(() => {
    if (stringifiedIdentity) {
      setIdentityInLocalStorage(stringifiedIdentity);
    }
  }, [stringifiedIdentity]);

  if (!identity || !stringifiedIdentity) {
    return <span>Initialising identity...</span>;
  }

  return (
    <IdentityContext.Provider
      value={{
        identity,
        setIdentity,
        stringifiedIdentity,
        generateIdentity: generateAndSetIdentity,
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
