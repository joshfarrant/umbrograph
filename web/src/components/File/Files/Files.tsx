import { Link, routes } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';
import { useEffect, useState } from 'react';

import { QUERY } from 'src/components/File/FilesCell';
import { Secrets } from 'src/components/atoms/secrets';
import { useSecrets } from 'src/contexts/secrets';
import { truncate } from 'src/lib/formatters';
import { base64ToPreviewUrl } from 'src/utils/crypto';

import type { DeleteFileMutationVariables, FindFiles } from 'types/graphql';

const DELETE_FILE_MUTATION = gql`
  mutation DeleteFileMutation($id: String!) {
    deleteFile(id: $id) {
      id
    }
  }
`;

type TEncryptedImageProps = {
  type: string;
  data: string;
};

const EncryptedImage = ({ type, data }: TEncryptedImageProps) => {
  const [src, setSrc] = useState<string | null>(null);
  const { key, iv } = useSecrets();

  useEffect(() => {
    base64ToPreviewUrl(key, iv, type, data)
      .then((previewUrl) => {
        setSrc(previewUrl);
      })
      .catch(() => setSrc(null));
  }, [key, iv, data, type]);

  if (!src) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      <img src={src} alt="Preview" />
    </div>
  );
};

const FilesList = ({ files }: FindFiles) => {
  const [deleteFile] = useMutation(DELETE_FILE_MUTATION, {
    onCompleted: () => {
      toast.success('File deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id: DeleteFileMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete file ' + id + '?')) {
      deleteFile({ variables: { id } });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mt-12 max-w-3xl space-y-12">
        <Secrets className="max-w-lg" />
        <div className="rw-segment rw-table-wrapper-responsive">
          <table className="rw-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Owner</th>
                <th>Type</th>
                <th>Preview</th>
                <th>Data</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{truncate(file.id)}</td>
                  <td>{truncate(file.owner)}</td>
                  <td>{truncate(file.type)}</td>
                  <td>
                    <EncryptedImage type={file.type} data={file.data} />
                  </td>
                  <td>{truncate(file.data)}</td>
                  <td>
                    <nav className="rw-table-actions">
                      <Link
                        to={routes.file({ id: file.id })}
                        title={'Show file ' + file.id + ' detail'}
                        className="rw-button rw-button-small"
                      >
                        Show
                      </Link>
                      <Link
                        to={routes.editFile({ id: file.id })}
                        title={'Edit file ' + file.id}
                        className="rw-button rw-button-small rw-button-blue"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        title={'Delete file ' + file.id}
                        className="rw-button rw-button-small rw-button-red"
                        onClick={() => onDeleteClick(file.id)}
                      >
                        Delete
                      </button>
                    </nav>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilesList;
