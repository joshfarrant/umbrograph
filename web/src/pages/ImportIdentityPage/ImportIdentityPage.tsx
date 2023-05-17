import { Link, routes } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';
import { IdentityUpload } from 'src/components/atoms/identity-upload';

const ImportIdentityPage = () => {
  return (
    <>
      <MetaTags title="ImportIdentity" description="ImportIdentity page" />

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Import Identity
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center overflow-hidden rounded-lg bg-white px-4 py-8 shadow sm:px-0">
              <IdentityUpload
                onUpload={() => {
                  console.log('uploaded');
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ImportIdentityPage;
