import clsx from 'clsx';

import { TFileUploadProps } from './file-upload.types';
import invariant from 'tiny-invariant';

export const FileUpload = ({
  className,
  onUpload,
  id,
  children,
  ...inputProps
}: TFileUploadProps) => {
  return (
    <>
      <label
        className={clsx(
          'inline-block cursor-pointer rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
          className
        )}
        htmlFor={id}
      >
        {children}
      </label>

      <input
        type="file"
        id={id}
        className="hidden"
        multiple
        onChange={(e) => {
          const { files } = e.target;

          invariant(files);

          onUpload(files);

          e.target.value = '';
        }}
        {...inputProps}
      />
    </>
  );
};
