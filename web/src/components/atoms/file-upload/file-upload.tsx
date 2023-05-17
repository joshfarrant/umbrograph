import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import invariant from 'tiny-invariant';

import { TFileUploadProps } from './file-upload.types';

export const FileUpload = ({
  onUpload,
  id,
  className,
  ...inputProps
}: TFileUploadProps) => {
  return (
    <>
      <div className="text-center">
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No images</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading an image.
        </p>
        <div className="mt-6">
          <label
            className={clsx(
              'inline-flex cursor-pointer items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
              className
            )}
            htmlFor={id}
          >
            <ArrowUpTrayIcon
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Upload images
          </label>
          <input
            type="file"
            id={id}
            className="hidden"
            onChange={(e) => {
              const { files } = e.target;

              invariant(files);

              onUpload(files);

              e.target.value = '';
            }}
            {...inputProps}
          />
        </div>
      </div>
    </>
  );
};
