import type {
  QueryResolvers,
  MutationResolvers,
  AlbumRelationResolvers,
} from 'types/graphql';

import { db } from 'src/lib/db';

export const albums: QueryResolvers['albums'] = () => {
  return db.album.findMany();
};

export const album: QueryResolvers['album'] = ({ id }) => {
  return db.album.findUnique({
    where: { id },
  });
};

export const createAlbum: MutationResolvers['createAlbum'] = ({ input }) => {
  return db.album.create({
    data: input,
  });
};

export const updateAlbum: MutationResolvers['updateAlbum'] = ({
  id,
  input,
}) => {
  return db.album.update({
    data: input,
    where: { id },
  });
};

export const deleteAlbum: MutationResolvers['deleteAlbum'] = ({ id }) => {
  return db.album.delete({
    where: { id },
  });
};

export const Album: AlbumRelationResolvers = {
  files: (_obj, { root }) => {
    return db.album.findUnique({ where: { id: root?.id } }).files();
  },
};
