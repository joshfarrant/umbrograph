import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';

import { MetaTags } from '@redwoodjs/web';
import {
  decryptFileContents,
  encryptFileContents,
  importSecrets,
} from 'src/utils/crypto';
import { JsonDownloadLink } from 'src/components/atoms/json-download-link';
import { useSecrets } from 'src/contexts/secrets';
import { FileUpload } from 'src/components/atoms/file-upload';

const PhotosPage = () => {
  const { key, iv, stringifiedSecrets, generateSecrets, setKey, setIv } =
    useSecrets();

  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [decryptedFileUrl, setDecryptedFileUrl] = useState<string | null>(null);
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const uploadSecretRef = useRef<HTMLInputElement>(null);

  const onFileUpload = async (file: File) => {
    const { encryptedFile } = await encryptFileContents(key, iv, file);

    setEncryptedFile(encryptedFile);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      invariant(typeof reader.result === 'string');

      setPreviewUrl(reader.result);

      if (uploadImageRef.current) {
        uploadImageRef.current.value = '';
      }
    });
  };

  const onSecretsUpload = async (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.addEventListener('load', async () => {
      const fileContents = reader.result;
      invariant(typeof fileContents === 'string');
      const jsonData = JSON.parse(fileContents);

      const secrets = await importSecrets(jsonData);
      const { key, iv } = secrets;
      setKey(key);
      setIv(iv);

      if (uploadSecretRef.current) {
        uploadSecretRef.current.value = '';
      }
    });
  };

  const onDecryptClick = async () => {
    invariant(encryptedFile);
    const contents = await decryptFileContents(key, iv, encryptedFile);
    setDecryptedFileUrl(URL.createObjectURL(contents));
  };

  return (
    <>
      <MetaTags title="Photos" description="Photos page" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-12 max-w-3xl space-y-12">
          <section className="space-y-6">
            <h2 className="text-xl">Generated secrets</h2>
            <pre className="rounded-md bg-gray-100 p-2 text-sm">
              {stringifiedSecrets}
            </pre>
            <div className="space-x-2">
              <FileUpload
                id="secrets-input"
                name="secrets"
                accept="application/json"
                onUpload={onSecretsUpload}
              >
                Upload secrets
              </FileUpload>

              <button
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => generateSecrets()}
              >
                Regenerate secrets
              </button>
              {stringifiedSecrets ? (
                <JsonDownloadLink
                  json={stringifiedSecrets}
                  filename="secrets.json"
                >
                  Download secrets
                </JsonDownloadLink>
              ) : null}
            </div>
          </section>

          <div className="border-t border-gray-900/10 pt-12">
            <FileUpload
              id="image-input"
              name="image"
              accept="image/*"
              onUpload={onFileUpload}
            >
              Upload an image
            </FileUpload>
          </div>

          <section className="flex flex-row border-t border-gray-900/10 pt-12">
            <div className="flex-1">
              {previewUrl ? (
                <div>
                  <h2>Uploaded image</h2>
                  <img src={previewUrl} alt="Preview" />
                </div>
              ) : (
                <span>Upload an image to see a preview</span>
              )}
            </div>

            <div className="flex-1">
              {previewUrl ? (
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
