import { InputHTMLAttributes } from 'react';

export type TIdentityUploadProps = InputHTMLAttributes<HTMLInputElement> & {
  onUpload: (selectedFiles: FileList) => void;
};
