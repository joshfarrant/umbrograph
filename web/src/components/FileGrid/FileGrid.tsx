import { useEffect, useState } from 'react';

import type { File as TFile } from 'types/graphql';

import { useIdentity } from 'src/contexts/identity';
import { arrayBufferToString, base64ToArrayBuffer } from 'src/utils/codec';
import {
  decryptData,
  getPrivateEncryptionIv,
  getPrivateEncryptionKey,
} from 'src/utils/crypto-v4';

import { TFileGridProps } from './FileGrid.types';

type TFileProps = {
  id: TFile['id'];
  albumId: TFile['albumId'];
  data: TFile['data'];
};

const FileItem = ({ id, albumId, data }: TFileProps) => {
  const { identity } = useIdentity();
  const [name, setName] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const decryptFile = async () => {
    const encryptedArrayBuffer = base64ToArrayBuffer(data);
    const decryptedArrayBuffer = await decryptData(
      getPrivateEncryptionKey(identity),
      getPrivateEncryptionIv(identity),
      encryptedArrayBuffer
    );
    const stringified = arrayBufferToString(decryptedArrayBuffer);
    const { contents, name, type } = JSON.parse(stringified);

    const imgSrc = `data:${type};base64,${contents}`;

    setImgSrc(imgSrc);
    setName(name);
    setType(type);
  };

  useEffect(() => {
    if (data) {
      decryptFile();
    }
  }, [data]);

  if (!imgSrc) {
    return <span>Loading...</span>;
  }

  return (
    <li className="relative">
      <div className="aspect-h-7 aspect-w-10 focus-within:ring-primary-500 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
        <img
          src={imgSrc}
          className="pointer-events-none object-contain group-hover:opacity-75"
        />
        <button type="button" className="absolute inset-0 focus:outline-none">
          <span className="sr-only">View details for {name}</span>
        </button>
      </div>
      <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
        {name}
      </p>
      <p className="pointer-events-none block text-sm font-medium text-gray-500">
        {type}
      </p>
    </li>
  );
};

export const FileGrid = ({ files }: TFileGridProps) => {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {files.map(({ id, albumId, data }) => (
        <FileItem key={id} id={id} albumId={albumId} data={data} />
      ))}
    </ul>
  );
};
