import { useState } from 'react';

import { FolderIcon } from '@heroicons/react/20/solid';
import { v4 as uuidv4 } from 'uuid';

import { navigate, routes } from '@redwoodjs/router';
import { MetaTags, useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { FileUpload } from 'src/components/atoms/file-upload';
import { useIdentity } from 'src/contexts/identity';
import { useConst } from 'src/hooks/use-const';
import {
  arrayBufferToBase64,
  fileToArrayBuffer,
  stringToArrayBuffer,
} from 'src/utils/codec';
import {
  encryptData,
  getPrivateEncryptionIv,
  getPrivateEncryptionKey,
} from 'src/utils/crypto-v4';

type TFileMeta = {
  name: string;
  type: string;
  file: File;
};

const CREATE_FILE_MUTATION = gql`
  mutation CreateFileMutation($input: CreateFileInput!) {
    createFile(input: $input) {
      id
    }
  }
`;

const NewAlbumPage = () => {
  const { identity } = useIdentity();

  const [files, setFiles] = useState<TFileMeta[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [albumId, setAlbumId] = useState(() => uuidv4());

  const [createFile, { loading, error }] = useMutation(CREATE_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('File created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onFileSelect = async (selectedFiles: FileList) => {
    const selectedFilesArray = Array.from(selectedFiles);

    const encryptedFiles = selectedFilesArray.map((file) => ({
      name: uuidv4(),
      file: file,
      type: file.type,
    }));

    setFiles((files) => [...files, ...encryptedFiles]);

    const nextPreviewUrls = selectedFilesArray.map((file) => {
      const blob = new Blob([file], { type: file.type });

      return URL.createObjectURL(blob);
    });
    setPreviewUrls(nextPreviewUrls);
  };

  const uploadSelectedFiles = async () => {
    const encryptedFilesPromises = files.map(async ({ file, name, type }) => {
      const fileArrayBuffer = await fileToArrayBuffer(file);

      const dataObj = {
        name: name,
        type: type,
        contents: arrayBufferToBase64(fileArrayBuffer),
      };

      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls((previewUrls) => [...previewUrls, previewUrl]);

      const data = JSON.stringify(dataObj);

      const arrayBuffer = stringToArrayBuffer(data);

      const encryptedDataArrayBuffer = await encryptData(
        getPrivateEncryptionKey(identity),
        getPrivateEncryptionIv(identity),
        arrayBuffer
      );

      const encryptedData = arrayBufferToBase64(encryptedDataArrayBuffer);

      return {
        albumId,
        data: encryptedData,
      };
    });

    const encryptedFiles = await Promise.all(encryptedFilesPromises);

    await Promise.all(
      encryptedFiles.map((file) => createFile({ variables: { input: file } }))
    );

    navigate(routes.album({ albumId }));

    setFiles([]);
  };

  return (
    <>
      <MetaTags title="Upload" description="Upload page" />
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              New Album
            </h1>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <FolderIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <span className="font-mono">{albumId}</span>
                <button
                  className="hover:text-primary-500 ml-2 underline"
                  onClick={() => {
                    setAlbumId(uuidv4());
                  }}
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                {files.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6">
                    <FileUpload
                      id="image-input"
                      name="image"
                      accept="image/*"
                      multiple
                      onUpload={onFileSelect}
                    />
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                        <div className="ml-4 mt-2">
                          <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Selected Images
                          </h3>
                        </div>
                        <div className="ml-4 mt-2 flex-shrink-0">
                          <button
                            type="button"
                            className="bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 inline-block cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={() => uploadSelectedFiles()}
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-5 sm:p-6">
                      <ul
                        role="list"
                        className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6"
                      >
                        {previewUrls.map((previewUrl) => (
                          <li
                            key={previewUrl}
                            className="col-span-1 flex items-center justify-center divide-y divide-gray-200 rounded-lg bg-white shadow"
                          >
                            <img src={previewUrl} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NewAlbumPage;
