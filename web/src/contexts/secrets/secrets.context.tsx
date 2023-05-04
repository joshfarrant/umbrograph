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
  stringifySecrets as cryptoStringifySecrets,
} from 'src/utils/crypto';
import { TSecretsContext, TSectetsProviderProps } from './secrets.types';

const SecretsContext = createContext<TSecretsContext | null>(null);

export const SecretsProvider = ({
  children,
}: TSectetsProviderProps): ReactElement => {
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [iv, setIv] = useState<Uint8Array | null>(null);
  const [stringifiedSecrets, setStringifiedSecrets] = useState<string | null>(
    null
  );

  const generateSecrets = async () => {
    const newKey = await generateKey();
    setKey(newKey);

    const newIv = generateIv();
    setIv(newIv);
  };

  const stringifySecrets = async () => {
    if (!key || !iv) {
      return;
    }

    const stringifiedSecrets = await cryptoStringifySecrets(key, iv);
    setStringifiedSecrets(stringifiedSecrets);
  };

  useEffect(() => {
    generateSecrets();
  }, []);

  useEffect(() => {
    stringifySecrets();
  }, [key, iv]);

  if (!key || !iv || !stringifiedSecrets) {
    return <span>Generating secrets...</span>;
  }

  return (
    <SecretsContext.Provider
      value={{ key, setKey, iv, setIv, stringifiedSecrets, generateSecrets }}
    >
      {children}
    </SecretsContext.Provider>
  );
};

export const useSecrets = () => {
  const context = useContext(SecretsContext);

  invariant(context, 'useSecrets must be used within a SecretsProvider');

  return context;
};
