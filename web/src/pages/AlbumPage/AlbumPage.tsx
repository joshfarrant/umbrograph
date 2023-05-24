import AlbumCell from 'src/components/AlbumCell';

type AlbumPageProps = {
  id: string;
};

const AlbumPage = ({ id }: AlbumPageProps) => {
  return <AlbumCell id={id} />;
};

export default AlbumPage;
