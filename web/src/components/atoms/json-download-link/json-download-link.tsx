import { ReactElement } from 'react';
import clsx from 'clsx';

import { JsonDownloadLinkProps } from './json-download-link.types';

export const JsonDownloadLink = ({
  json,
  filename,
  className,
  ...linkProps
}: JsonDownloadLinkProps): ReactElement => {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  return (
    <a
      className={clsx(
        'inline-block rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        className
      )}
      href={url}
      download={filename}
      {...linkProps}
    />
  );
};
