import { HTMLAttributes, useState } from 'react';

import {
  KeyIcon,
  ChevronRightIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { Link } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';

import { JsonDownloadLink } from 'src/components/atoms/json-download-link';
import { useIdentity } from 'src/contexts/identity';
import { useAsyncState } from 'src/hooks/use-async-state';
import { getPublicSigningKey, stringifyRsaKey } from 'src/utils/crypto-v4';

type TFaqProps = {
  question: string;
  answer: string;
};

const Faq = ({ question, answer }: TFaqProps) => (
  <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
    <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
      {question}
    </dt>
    <dd className="mt-4 lg:col-span-7 lg:mt-0">
      <p className="text-base leading-7 text-gray-600">{answer}</p>
    </dd>
  </div>
);

type TActionProps = {
  iconColor: string;
  renderIcon: (props: Record<string, unknown>) => JSX.Element;
  route: string;
  name: string;
};

const Action = ({ iconColor, renderIcon, route, name }: TActionProps) => (
  <li>
    <Link to={route}>
      <div className="group relative flex cursor-pointer items-start items-center space-x-3 py-4">
        <div className="flex-shrink-0">
          <span
            className={clsx(
              iconColor,
              'inline-flex h-10 w-10 items-center justify-center rounded-lg'
            )}
          >
            {renderIcon({
              className: 'h-6 w-6 text-white',
              'aria-hidden': 'true',
            })}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900">{name}</div>
        </div>
        <div className="flex-shrink-0 self-center">
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  </li>
);

type TSecretTextProps = HTMLAttributes<HTMLDivElement>;

const SecretText = ({ className, children }: TSecretTextProps) => {
  const [showSecret, setShowSecret] = useState(false);

  const toggleShowSecret = () => {
    setShowSecret((prev) => !prev);
  };

  return (
    <div
      className={clsx('group cursor-pointer', className)}
      onClick={toggleShowSecret}
    >
      {showSecret ? (
        children
      ) : (
        <span className="text-gray-400 group-hover:text-gray-500">
          Click to view
        </span>
      )}
    </div>
  );
};

const IdentityPage = () => {
  const { identity, stringifiedIdentity } = useIdentity();

  const [digest] = useAsyncState(() =>
    stringifyRsaKey(getPublicSigningKey(identity))
  );

  return (
    <>
      <MetaTags title="GetStarted" description="Identity page" />

      <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-row flex-wrap items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Your Identity
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              {digest ? (
                <div className="mt-2 flex items-center font-mono text-sm text-gray-500">
                  <KeyIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="truncate overflow-ellipsis">
                    {digest.substring(0, 24)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-5 flex flex-row flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <TrashIcon
                className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Forget Identity
            </button>

            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ArrowPathIcon
                className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Create New Identity
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ArrowUpTrayIcon
                className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Upload Identity
            </button>

            <JsonDownloadLink
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              json={stringifiedIdentity}
              filename="identity.json"
            >
              <ArrowDownTrayIcon
                className="-ml-0.5 mr-1.5 h-5 w-5"
                aria-hidden="true"
              />
              Download Identity
            </JsonDownloadLink>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center overflow-hidden rounded-lg bg-white px-4 py-8 shadow sm:px-0">
          <div className="divide-y divide-gray-900/10 px-6 lg:px-8">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Learn more about Identities
            </h2>
            <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
              <Faq
                question="What is an Identity?"
                answer="Your Identity is your key to viewing your images. It's a random piece of data which is securely generated on your device which you can (and should!) download and keep safe. Without your Identity you won't be able to view any of the images you upload."
              />

              <Faq
                question="How does it work?"
                answer="Your Identity is used to securely encrypt your images before they
                                                                                                                                                                                          ever leave your device. It's then used again to decrypt your images on your device when you come back to view them. Your Identity never leaves your machine."
              />

              <Faq
                question="Can anyone else see my images?"
                answer="Nope. Complete privacy is the reason Umbrograph exists, so no-one — not us, not our servers, not our cat Alan — can see your images. Without your Identity, your images are encrypted, garbled nonsense."
              />

              <Faq
                question="Is all this secure?"
                answer="Images are encrypted before they ever leave your device and can only ever be decrypted on your device using your Identity. Images are encrypted using AES-GCM, a widely accepted and secure encryption algorithm that provides complete confidentiality of data. AES-GCM is used in many applications including online banking, secure messaging, and cloud storage. Its security has been extensively reviewed and tested by experts in the field, and it is considered a reliable choice for protecting sensitive information."
              />
            </dl>
          </div>
        </div>
      </main>
    </>
  );
};

export default IdentityPage;
