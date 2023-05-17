import { PropsWithChildren, useEffect, useState } from 'react';

import clsx from 'clsx';

import { Link, routes } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';

import { useScrollingRandomString } from 'src/hooks/use-scrolling-random-string';

type TCharacterProps = PropsWithChildren<{
  isLocked?: boolean;
}>;

const Character = ({ children, isLocked }: TCharacterProps) => (
  <span
    className={clsx(
      'mx-1 inline-block rounded-sm p-2 text-3xl font-medium',
      isLocked ? 'text-green-500' : 'bg-gray-200 text-gray-600'
    )}
  >
    {children}
  </span>
);

type TIdentityAnimationProps = {
  onStart?: (lockedString: string) => void;
  onComplete?: (lockedString: string) => void;
  finalString: string;
};

const IdentityAnimation = ({
  finalString,
  onComplete = () => {},
}: TIdentityAnimationProps) => {
  const { randomString, lockedString } = useScrollingRandomString({
    finalString,
  });

  const randomStringArray = randomString.split('');
  const lockedStringArray = lockedString.split('');

  const allLocked = randomString.length === 0;

  useEffect(() => {
    if (allLocked) {
      onComplete(lockedString);
    }
  }, [randomString, lockedString]);

  return (
    <div
      className={clsx(
        'inline-flex justify-center rounded-md p-3 font-mono',
        allLocked
          ? 'bg-green-100 transition transition-all delay-200 duration-200'
          : 'bg-gray-100'
      )}
    >
      {lockedStringArray.map((letter, index) => (
        <Character key={index} isLocked>
          {letter}
        </Character>
      ))}
      {randomStringArray.map((letter, index) => (
        <Character key={index}>{letter}</Character>
      ))}
    </div>
  );
};

const getRandomString = (length: number): string => {
  const uuid = window.crypto.randomUUID();

  return uuid.replaceAll('-', '').slice(0, length);
};

const GenerateIdentityPage = () => {
  const [randomString, setRandomString] = useState(() => getRandomString(16));
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  return (
    <>
      <MetaTags title="GenerateIdentity" description="GenerateIdentity page" />

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Generate Identity
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center overflow-hidden rounded-lg bg-white px-4 py-8 shadow sm:px-0">
              {userHasInteracted && (
                <IdentityAnimation finalString={randomString} />
              )}
              <button
                type="button"
                className="my-3 inline-block cursor-pointer rounded-md bg-primary-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                onClick={() => {
                  setUserHasInteracted(true);
                  setRandomString(getRandomString(16));
                }}
              >
                Regenerate
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GenerateIdentityPage;
