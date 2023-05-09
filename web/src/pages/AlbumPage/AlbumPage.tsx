import AlbumCell from 'src/components/AlbumCell';

type AlbumPageProps = {
  albumId: string;
};

const AlbumPage = ({ albumId }: AlbumPageProps) => {
  return <AlbumCell albumId={albumId} />;
};

export default AlbumPage;
