import { MetaTags } from '@redwoodjs/web';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { FileUpload } from 'src/components/atoms/file-upload';
import { useSecrets } from 'src/contexts/secrets';
import { encryptFileContents, fileToPreviewUrl } from 'src/utils/crypto';

type TFileMeta = {
  id: string;
  arrayBuffer: ArrayBuffer;
  type: string;
  previewUrl: string;
};

const encryptFileData = async (
  key: CryptoKey,
  iv: Uint8Array,
  file: File
): Promise<TFileMeta> => {
  const [arrayBuffer, previewUrl] = await Promise.all([
    encryptFileContents(key, iv, file),
    fileToPreviewUrl(file),
  ]);

  return {
    id: uuidv4(),
    arrayBuffer,
    type: file.type,
    previewUrl,
  };
};

const UploadPage = () => {
  const { key, iv } = useSecrets();

  const [files, setFiles] = useState<TFileMeta[]>([]);

  const onFileUpload = async (selectedFiles: FileList) => {
    const selectedFilesArray = Array.from(selectedFiles);

    const promises = selectedFilesArray.map((file) =>
      encryptFileData(key, iv, file)
    );

    const encryptedFiles = await Promise.all(promises);

    setFiles((files) => [...files, ...encryptedFiles]);
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
                  onUpload={onFileUpload}
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
                          onUpload={onFileUpload}
                        >
                          Add images
                        </FileUpload>
                        <button
                          type="button"
                          className="inline-block cursor-pointer rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                          key={file.id}
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
