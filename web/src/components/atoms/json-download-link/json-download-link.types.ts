import { AnchorHTMLAttributes } from 'react';

export type JsonDownloadLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  json: string;
  filename: string;
};
