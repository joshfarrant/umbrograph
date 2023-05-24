import type { FindAlbumQuery, FindAlbumQueryVariables } from 'types/graphql';

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web';

import { Album } from 'src/components/Album';

export const QUERY = gql`
  query FindAlbumQuery($id: String!) {
    album: album(id: $id) {
      id
      files {
        id
        data
      }
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindAlbumQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({
  album,
}: CellSuccessProps<FindAlbumQuery, FindAlbumQueryVariables>) => {
  return <Album files={album.files} />;
};
