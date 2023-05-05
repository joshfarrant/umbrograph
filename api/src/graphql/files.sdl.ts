export const schema = gql`
  type File {
    id: String!
    owner: String!
    data: String!
    type: String!
  }

  type Query {
    files: [File!]! @requireAuth
    file(id: String!): File @requireAuth
  }

  input CreateFileInput {
    owner: String!
    data: String!
    type: String!
  }

  input UpdateFileInput {
    owner: String
    data: String
    type: String
  }

  type Mutation {
    createFile(input: CreateFileInput!): File! @requireAuth
    updateFile(id: String!, input: UpdateFileInput!): File! @requireAuth
    deleteFile(id: String!): File! @requireAuth
  }
`;
