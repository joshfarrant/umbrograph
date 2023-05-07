import { InputHTMLAttributes } from 'react';

export type TFileUploadProps = InputHTMLAttributes<HTMLInputElement> & {
  onUpload: (selectedFiles: FileList) => void;
};
