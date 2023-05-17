import invariant from 'tiny-invariant';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { KeyIcon } from '@heroicons/react/24/outline';

import { TIdentityUploadProps } from './identity-upload.types';
import clsx from 'clsx';

export const IdentityUpload = ({
  onUpload,
  id,
  className,
  ...inputProps
}: TIdentityUploadProps) => {
  return (
    <>
      <div className="text-center">
        <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Upload identity
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You can only have one uploaded identity.
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
            Upload identity
          </label>
          <input
            type="file"
            id={id}
            className="hidden"
            onChange={(e) => {
              const { files } = e.target;

              const identity = files?.[0];

              invariant(identity);

              onUpload(identity);

              e.target.value = '';
            }}
            {...inputProps}
          />
        </div>
      </div>
    </>
  );
};
