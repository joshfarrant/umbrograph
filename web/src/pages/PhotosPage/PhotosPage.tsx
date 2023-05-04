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

const PhotosPage = () => {
  const { key, iv, stringifiedSecrets, generateSecrets, setKey, setIv } =
    useSecrets();

  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [decryptedFileUrl, setDecryptedFileUrl] = useState<string | null>(null);
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const uploadSecretRef = useRef<HTMLInputElement>(null);

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    invariant(files);

    const selectedFile = files[0];

    if (!selectedFile) {
      return;
    }

    const { encryptedFile } = await encryptFileContents(key, iv, selectedFile);

    setEncryptedFile(encryptedFile);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.addEventListener('load', () => {
      invariant(typeof reader.result === 'string');

      setPreviewUrl(reader.result);

      if (uploadImageRef.current) {
        uploadImageRef.current.value = '';
      }
    });
  };

  const onSecretsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    invariant(files);

    const secretsFile = files[0];

    if (!secretsFile) {
      return;
    }

    const reader = new FileReader();
    reader.readAsText(secretsFile);

    reader.onload = async () => {
      const fileContents = reader.result as string;
      const jsonData = JSON.parse(fileContents);

      const secrets = await importSecrets(jsonData);
      const { key, iv } = secrets;
      setKey(key);
      setIv(iv);

      if (uploadSecretRef.current) {
        uploadSecretRef.current.value = '';
      }
    };
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
            <pre className="rounded-md bg-gray-100 p-2">
              {stringifiedSecrets}
            </pre>
            <div className="space-x-2">
              <label
                className="inline-block rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                htmlFor="secrets-input"
              >
                Upload secrets
              </label>

              <input
                ref={uploadSecretRef}
                type="file"
                id="secrets-input"
                name="secrets"
                accept="application/json"
                className="hidden"
                onChange={onSecretsUpload}
              />

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

          <form
            className="border-t border-gray-900/10 pt-12"
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e);
            }}
          >
            <label
              htmlFor="image-input"
              className="inline-block rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Upload an image
            </label>
            <input
              ref={uploadImageRef}
              type="file"
              id="image-input"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={onFileUpload}
            />
          </form>

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
