import { MetaTags, useMutation } from '@redwoodjs/web';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { FileUpload } from 'src/components/atoms/file-upload';
import { useIdentity } from 'src/contexts/identity';
import { encryptData } from 'src/utils/crypto-v3';
import {
  arrayBufferToBase64,
  fileToPreviewUrl,
  stringToArrayBuffer,
} from 'src/utils/codec';
import { toast } from '@redwoodjs/web/toast';

type TFileMeta = {
  name: string;
  encryptedArrayBuffer: ArrayBuffer;
  type: string;
  previewUrl: string;
  file: File;
};

const encryptFileData = async (
  key: CryptoKey,
  iv: Uint8Array,
  file: File
): Promise<TFileMeta> => {
  const fileArrayBuffer = await file.arrayBuffer();

  /**
   * TODO PreviewURL should be generated in the <Image /> component
   * and memoised
   */
  const [encryptedArrayBuffer, previewUrl] = await Promise.all([
    encryptData(key, iv, fileArrayBuffer),
    fileToPreviewUrl(file),
  ]);

  return {
    name: uuidv4(),
    encryptedArrayBuffer,
    file: file,
    type: file.type,
    previewUrl,
  };
};

const CREATE_FILE_MUTATION = gql`
  mutation CreateFileMutation($input: CreateFileInput!) {
    createFile(input: $input) {
      id
    }
  }
`;

const UploadPage = () => {
  const { key, iv } = useIdentity();

  const [files, setFiles] = useState<TFileMeta[]>([]);

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

    const promises = selectedFilesArray.map((file) =>
      encryptFileData(key, iv, file)
    );

    const encryptedFiles = await Promise.all(promises);

    setFiles((files) => [...files, ...encryptedFiles]);
  };

  const uploadSelectedFiles = async () => {
    const encryptedFilesPromises = files.map(async (file) => {
      const dataObj = {
        name: file.name,
        type: file.type,
        contents: arrayBufferToBase64(file.encryptedArrayBuffer),
      };

      const data = JSON.stringify(dataObj);

      const arrayBuffer = stringToArrayBuffer(data);

      const encryptedDataArrayBuffer = await encryptData(key, iv, arrayBuffer);

      const encryptedData = arrayBufferToBase64(encryptedDataArrayBuffer);

      return {
        albumId: 'josh-test-1',
        data: encryptedData,
      };
    });

    const encryptedFiles = await Promise.all(encryptedFilesPromises);

    await Promise.all(
      encryptedFiles.map((file) => createFile({ variables: { input: file } }))
    );

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
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {files.length === 0 ? (
                <FileUpload
                  id="image-input"
                  name="image"
                  accept="image/*"
                  onUpload={onFileSelect}
                >
                  Select images
                </FileUpload>
              ) : (
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                      <div className="ml-4 mt-2">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                          Selected Images
                        </h3>
                      </div>
                      <div className="ml-4 mt-2 flex-shrink-0 space-x-2">
                        <FileUpload
                          id="image-input"
                          name="image"
                          accept="image/*"
                          onUpload={onFileSelect}
                        >
                          Add images
                        </FileUpload>
                        <button
                          type="button"
                          className="inline-block cursor-pointer rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                      {files.map((file) => (
                        <li
                          key={file.name}
                          className="col-span-1 flex items-center justify-center divide-y divide-gray-200 rounded-lg bg-white shadow"
                        >
                          <img src={file.previewUrl} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UploadPage;
