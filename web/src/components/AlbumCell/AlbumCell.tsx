import type {
  FindFilesInAlbum,
  FindFilesInAlbumVariables,
} from 'types/graphql';
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web';

export const QUERY = gql`
  query FindFilesInAlbum($albumId: String!) {
    files(albumId: $albumId) {
      id
      albumId
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
  return <div>{JSON.stringify(files)}</div>;
};
