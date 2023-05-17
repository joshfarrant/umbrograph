import type {
  FindFilesInAlbum,
  FindFilesInAlbumVariables,
} from 'types/graphql';
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web';
import { Album } from 'src/components/Album';

export const QUERY = gql`
  query FindFilesInAlbum($albumId: String!) {
    files(albumId: $albumId) {
      id
      albumId
      data
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindFilesInAlbumVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  files,
}: CellSuccessProps<FindFilesInAlbum, FindFilesInAlbumVariables>) => {
  return <Album files={files} />;
};
