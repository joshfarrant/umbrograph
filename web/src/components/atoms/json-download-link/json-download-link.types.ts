import { HTMLAttributes } from 'react';

export type JsonDownloadLinkProps = HTMLAttributes<HTMLAnchorElement> & {
  json: string;
  filename: string;
};
