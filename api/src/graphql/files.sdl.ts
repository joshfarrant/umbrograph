export const schema = gql`
  type File {
    id: String!
    data: String!
    albumId: String!
    Album: Album!
  }

  type Query {
    files: [File!]! @requireAuth
    file(id: String!): File @requireAuth
  }

  input CreateFileInput {
    data: String!
    albumId: String!
  }

  input UpdateFileInput {
    data: String
    albumId: String
  }

  type Mutation {
    createFile(input: CreateFileInput!): File! @requireAuth
    updateFile(id: String!, input: UpdateFileInput!): File! @requireAuth
    deleteFile(id: String!): File! @requireAuth
  }
`;
