export const schema = gql`
  type Album {
    id: String!
    owner: String!
    title: String
    files: [File]!
  }

  type Query {
    albums: [Album!]! @requireAuth
    album(id: String!): Album @requireAuth
  }

  input CreateAlbumInput {
    owner: String!
    title: String
  }

  input UpdateAlbumInput {
    owner: String
    title: String
  }

  type Mutation {
    createAlbum(input: CreateAlbumInput!): Album! @requireAuth
    updateAlbum(id: String!, input: UpdateAlbumInput!): Album! @requireAuth
    deleteAlbum(id: String!): Album! @requireAuth
  }
`;
