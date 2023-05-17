import { ReactElement } from 'react';

import { JsonDownloadLinkProps } from './json-download-link.types';

export const JsonDownloadLink = ({
  json,
  filename,
  ...linkProps
}: JsonDownloadLinkProps): ReactElement => {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  return <a href={url} download={filename} {...linkProps} />;
};
