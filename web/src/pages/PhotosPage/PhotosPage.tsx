import { useState } from 'react';
import invariant from 'tiny-invariant';
import { MetaTags } from '@redwoodjs/web';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { arrayBufferToBase64, arrayBufferToFile } from 'src/utils/codec';
import { useIdentity } from 'src/contexts/identity';
import { FileUpload } from 'src/components/atoms/file-upload';
import type { CreateFileInput } from 'types/graphql';
import { Secrets } from 'src/components/atoms/secrets';
import { decryptData, encryptData } from 'src/utils/crypto-v3';

const CREATE_FILE_MUTATION = gql`
  mutation CreateFileMutation($input: CreateFileInput!) {
    createFile(input: $input) {
      id
    }
  }
`;

const PhotosPage = () => {
  const { key, iv } = useIdentity();

  const [encryptedFileType, setEncryptedFileType] = useState<string | null>(
    null
  );
  const [encryptedArrayBuffer, setEncryptedArrayBuffer] =
    useState<ArrayBuffer | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [decryptedFileUrl, setDecryptedFileUrl] = useState<string | null>(null);

  const [createFile, { loading, error }] = useMutation(CREATE_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('File created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onFileUpload = async (files: FileList) => {
    const file = files[0];

    const fileArrayBuffer = await file.arrayBuffer();

    const arrayBuffer = await encryptData(key, iv, fileArrayBuffer);
    setEncryptedArrayBuffer(arrayBuffer);

    setEncryptedFileType(file.type);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      const { result } = reader;
      invariant(typeof result === 'string');

      setPreviewUrls((urls) => [...urls, result]);
    });
  };

  const onDecryptClick = async () => {
    invariant(encryptedArrayBuffer);
    invariant(encryptedFileType);

    const arrayBuffer = await decryptData(key, iv, encryptedArrayBuffer);
    const file = arrayBufferToFile(arrayBuffer, encryptedFileType);
    setDecryptedFileUrl(URL.createObjectURL(file));
  };

  const saveFile = () => {
    invariant(encryptedArrayBuffer);
    invariant(encryptedFileType);

    const base64 = arrayBufferToBase64(encryptedArrayBuffer);

    const input: CreateFileInput = {
      albumId: 'josh',
      type: encryptedFileType,
      data: base64,
    };

    createFile({ variables: { input } });
  };

  return (
    <>
      <MetaTags title="Photos" description="Photos page" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-12 max-w-3xl space-y-12">
          <Secrets />
          <div className="space-x-2 border-t border-gray-900/10 pt-12">
            <FileUpload
              id="image-input"
              name="image"
              accept="image/*"
              onUpload={onFileUpload}
            >
              Upload an image
            </FileUpload>
            {previewUrls.length > 0 ? (
              <button
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => saveFile()}
              >
                Save to API
              </button>
            ) : null}
          </div>

          <section className="flex flex-row border-t border-gray-900/10 pt-12">
            <div className="flex-1">
              {previewUrls.length > 0 ? (
                previewUrls.map((previewUrl) => (
                  <div>
                    <h2>Uploaded image</h2>
                    <img src={previewUrl} alt="Preview" />
                  </div>
                ))
              ) : (
                <span>Upload an image to see a preview</span>
              )}
            </div>

            <div className="flex-1">
              {previewUrls.length > 0 ? (
                decryptedFileUrl ? (
                  <div>
                    <h2>Decrypted image</h2>
                    <img src={decryptedFileUrl} alt="Preview" />
                  </div>
                ) : (
                  <button
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => onDecryptClick()}
                  >
                    Decrypt
                  </button>
                )
              ) : null}
            </div>
          </section>

          <section className="border-t border-gray-900/10 pt-12"></section>
        </div>
      </div>
    </>
  );
};

export default PhotosPage;
