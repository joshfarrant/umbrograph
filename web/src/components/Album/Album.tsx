import { FileGrid } from '../FileGrid';
import { TAlbumProps } from './Album.types';

export const Album = ({ files }: TAlbumProps) => {
  return <FileGrid files={files} />;
};
