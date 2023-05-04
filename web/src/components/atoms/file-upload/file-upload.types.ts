import { InputHTMLAttributes } from 'react';

export type TFileUploadProps = InputHTMLAttributes<HTMLInputElement> & {
  onUpload: (file: File) => void;
};
