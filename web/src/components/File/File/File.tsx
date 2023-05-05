import { Link, routes, navigate } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import {} from 'src/lib/formatters';

import type { DeleteFileMutationVariables, FindFileById } from 'types/graphql';

const DELETE_FILE_MUTATION = gql`
  mutation DeleteFileMutation($id: String!) {
    deleteFile(id: $id) {
      id
    }
  }
`;

interface Props {
  file: NonNullable<FindFileById['file']>;
}

const File = ({ file }: Props) => {
  const [deleteFile] = useMutation(DELETE_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('File deleted');
      navigate(routes.files());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteFileMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete file ' + id + '?')) {
      deleteFile({ variables: { id } });
    }
  };

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            File {file.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{file.id}</td>
            </tr>
            <tr>
              <th>Owner</th>
              <td>{file.owner}</td>
            </tr>
            <tr>
              <th>Data</th>
              <td>{file.type}</td>
            </tr>
            <tr>
              <th>Data</th>
              <td>{file.data}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editFile({ id: file.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(file.id)}
        >
          Delete
        </button>
      </nav>
    </>
  );
};

export default File;
