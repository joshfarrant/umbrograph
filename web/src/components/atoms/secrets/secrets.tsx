import invariant from 'tiny-invariant';
import clsx from 'clsx';
import { JsonDownloadLink } from 'src/components/atoms/json-download-link';
import { useIdentity } from 'src/contexts/identity';
import { importIdentity } from 'src/utils/crypto-v3';
import { FileUpload } from '../file-upload';
import { TSecretsProps } from './secrets.types';

export const Secrets = ({ className, ...sectionProps }: TSecretsProps) => {
  const { stringifiedIdentity, generateIdentity, setKey, setIv } =
    useIdentity();

  const onSecretsUpload = async (files: FileList) => {
    const file = files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.addEventListener('load', async () => {
      const fileContents = reader.result;
      invariant(typeof fileContents === 'string');
      const jsonData = JSON.parse(fileContents);

      const secrets = await importIdentity(jsonData);
      const { key, iv } = secrets;
      setKey(key);
      setIv(iv);
    });
  };

  return (
    <section className={clsx('space-y-6', className)} {...sectionProps}>
      <h2 className="text-xl">Generated secrets</h2>
      <pre className="rounded-md bg-gray-100 p-2 text-sm">
        {stringifiedIdentity}
      </pre>
      <div className="space-x-2">
        <FileUpload
          id="secrets-input"
          name="secrets"
          accept="application/json"
          onUpload={onSecretsUpload}
        >
          Upload secrets
        </FileUpload>

        <button
          className="bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => generateIdentity()}
        >
          Regenerate secrets
        </button>
        {stringifiedIdentity ? (
          <JsonDownloadLink json={stringifiedIdentity} filename="secrets.json">
            Download secrets
          </JsonDownloadLink>
        ) : null}
      </div>
    </section>
  );
};
