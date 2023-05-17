import * as O from 'optics-ts/standalone';

const versionLens = O.prop('version');
const getVersion = O.get(versionLens);
const setVersion = O.set(versionLens);

const publicKeysLens = O.compose('keys', 'public');
const privateKeysLens = O.compose('keys', 'private');

const publicSigningKeyLens = O.compose(publicKeysLens, 'signing');
const getPublicSigningKey = O.get(publicSigningKeyLens);
const setPublicSigningKey = O.set(publicSigningKeyLens);

const privateSigningKeyLens = O.compose(privateKeysLens, 'signing');
const getPrivateSigningKey = O.get(privateSigningKeyLens);
const setPrivateSigningKey = O.set(privateSigningKeyLens);

// prettier-ignore
const privateEncryptionKeyLens = O.compose(privateKeysLens, 'encryption', 'key');
const getPrivateEncryptionKey = O.get(privateEncryptionKeyLens);
const setPrivateEncryptionKey = O.set(privateEncryptionKeyLens);

const privateEncryptionIvLens = O.compose(privateKeysLens, 'encryption', 'iv');
const getPrivateEncryptionIv = O.get(privateEncryptionIvLens);
const setPrivateEncryptionIv = O.set(privateEncryptionIvLens);

export {
  getVersion,
  getPublicSigningKey,
  getPrivateSigningKey,
  getPrivateEncryptionKey,
  getPrivateEncryptionIv,
  setVersion,
  setPublicSigningKey,
  setPrivateSigningKey,
  setPrivateEncryptionKey,
  setPrivateEncryptionIv,
};
