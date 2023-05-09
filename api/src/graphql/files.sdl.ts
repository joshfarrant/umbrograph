export const schema = gql`
  type File {
    id: String!
    albumId: String!
    data: String!
  }

  type Query {
    files(albumId: String!): [File!]! @requireAuth
    file(id: String!): File @requireAuth
  }

  input CreateFileInput {
    albumId: String!
    data: String!
  }

  input UpdateFileInput {
    albumId: String
    data: String
  }

  type Mutation {
    createFile(input: CreateFileInput!): File! @requireAuth
    updateFile(id: String!, input: UpdateFileInput!): File! @requireAuth
    deleteFile(id: String!): File! @requireAuth
  }
`;
